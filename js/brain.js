/* Interactive anatomical 3D brain — real GLB mesh + consciousness region highlights */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

(function () {
  const REGION_IDS = [
    "thalamus",
    "pfc",
    "hotzone",
    "claustrum",
    "brainstem",
    "dmn",
    "acc",
    "insula"
  ];

  const REGION_COLORS = {
    thalamus: 0xf472b6,
    pfc: 0x67e8f9,
    hotzone: 0xa78bfa,
    claustrum: 0xfcd34d,
    brainstem: 0xfb923c,
    dmn: 0x6ee7b7,
    acc: 0x38bdf8,
    insula: 0xe879f9
  };

  const BASE_COLOR = 0xd4a5a5;
  const BASE_EMISSIVE = 0x1a1018;
  const DIM_OPACITY = 0.28;
  const NORMAL_OPACITY = 0.92;

  let renderer, scene, camera, controlsProxy, animId, selected = null;
  let raycaster, pointer;
  let container, detailEl, chipBox, loadingEl;
  let inited = false;
  let starting = false;
  let reducedMotion = false;
  let brainRoot = null;
  let regionMeshes = {}; // id -> THREE.Mesh[]
  let allPickable = [];
  let nameToMesh = new Map();
  let regionMap = null;
  let baseMaterials = new WeakMap(); // mesh -> {color, emissive, opacity, transparent}
  let autoSpin = true;
  let rotY = 0.55;
  let rotX = 0.12;
  let camDist = 2.6;

  function lang() {
    return document.documentElement.getAttribute("data-lang") || "zh";
  }
  function B() {
    return window.t(lang()).brain;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setLoading(msg) {
    if (!loadingEl) return;
    if (!msg) {
      loadingEl.hidden = true;
      loadingEl.textContent = "";
      return;
    }
    loadingEl.hidden = false;
    loadingEl.textContent = msg;
  }

  function showDetail(id) {
    selected = id;
    const b = B();
    const r = b.regions[id];
    if (!detailEl || !r) return;
    detailEl.innerHTML =
      `<h3>${escapeHtml(r.name)}</h3>` +
      `<p class="brain-role"><strong>${escapeHtml(b.roleLabel)}</strong> ${escapeHtml(r.role)}</p>` +
      `<p class="brain-link"><strong>${escapeHtml(b.linkLabel)}</strong> ${escapeHtml(r.link)}</p>` +
      (r.note ? `<p class="brain-note">${escapeHtml(r.note)}</p>` : "");
    applyHighlight(id);
    if (chipBox) {
      chipBox.querySelectorAll(".brain-chip").forEach((c) => {
        c.setAttribute("aria-pressed", c.dataset.region === id ? "true" : "false");
      });
    }
  }

  function storeBase(mesh) {
    if (baseMaterials.has(mesh)) return;
    const mat = mesh.material;
    if (!mat) return;
    // clone so we can mutate per-mesh
    if (!mat.userData || !mat.userData._brainCloned) {
      mesh.material = mat.clone();
      mesh.material.userData = { ...(mat.userData || {}), _brainCloned: true };
    }
    const m = mesh.material;
    m.transparent = true;
    m.depthWrite = true;
    baseMaterials.set(mesh, {
      color: m.color ? m.color.clone() : new THREE.Color(BASE_COLOR),
      emissive: m.emissive ? m.emissive.clone() : new THREE.Color(0x000000),
      opacity: m.opacity != null ? m.opacity : 1,
      emissiveIntensity: m.emissiveIntensity != null ? m.emissiveIntensity : 0.2
    });
  }

  function applyHighlight(id) {
    const activeSet = new Set(regionMeshes[id] || []);
    // Reset all pickable / visible cortex meshes
    nameToMesh.forEach((mesh) => {
      storeBase(mesh);
      const base = baseMaterials.get(mesh);
      const mat = mesh.material;
      if (!mat || !base) return;
      const isActive = activeSet.has(mesh);
      if (selected && !isActive) {
        mat.color.copy(base.color).multiplyScalar(0.45);
        if (mat.emissive) mat.emissive.setHex(0x000000);
        mat.opacity = DIM_OPACITY;
        mat.emissiveIntensity = 0;
      } else if (isActive) {
        const c = REGION_COLORS[id] || 0xffffff;
        mat.color.setHex(c);
        if (mat.emissive) mat.emissive.setHex(c);
        mat.emissiveIntensity = 0.55;
        mat.opacity = 1;
      } else {
        mat.color.copy(base.color);
        if (mat.emissive) mat.emissive.copy(base.emissive);
        mat.emissiveIntensity = base.emissiveIntensity;
        mat.opacity = base.opacity;
      }
      mat.needsUpdate = true;
    });
    // Claustrum markers
    (regionMeshes.claustrum || []).forEach((mesh) => {
      const mat = mesh.material;
      if (!mat) return;
      const on = id === "claustrum";
      mat.emissiveIntensity = on ? 0.8 : 0.15;
      mat.opacity = on ? 0.95 : 0.55;
      mat.color.setHex(REGION_COLORS.claustrum);
      if (mat.emissive) mat.emissive.setHex(REGION_COLORS.claustrum);
    });
  }

  function renderChips() {
    if (!chipBox) return;
    const b = B();
    chipBox.innerHTML = REGION_IDS.map((id) => {
      const name = b.regions[id] ? b.regions[id].name : id;
      return `<button type="button" class="brain-chip" data-region="${id}" aria-pressed="${
        selected === id ? "true" : "false"
      }">${escapeHtml(name)}</button>`;
    }).join("");
    chipBox.querySelectorAll(".brain-chip").forEach((btn) => {
      btn.addEventListener("click", () => showDetail(btn.dataset.region));
    });
  }

  function onLangChange() {
    renderChips();
    if (selected) showDetail(selected);
    else if (detailEl) {
      const b = B();
      detailEl.innerHTML = `<p class="brain-hint">${escapeHtml(b.hint)}</p>`;
    }
    if (loadingEl && !loadingEl.hidden) {
      const b = B();
      setLoading(b.loading || "Loading…");
    }
  }

  function fitCameraToObject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center); // center at origin
    const maxDim = Math.max(size.x, size.y, size.z);
    camDist = maxDim * 1.55;
    controlsProxy.update();
  }

  function categorizeName(name, categoryFromMap) {
    // Prefer manifest category via regionMap lookup built at load
    return categoryFromMap || "other";
  }

  function buildClaustrumMarkers() {
    // Educational approx: thin sheet between putamen and insula (bilateral)
    const markers = [];
    ["l", "r"].forEach((side) => {
      const putamen = nameToMesh.get(`Putamen.${side}`);
      const insula =
        nameToMesh.get(`Insula (Subcentral gyrus and ant. and post. sulci*).${side}`) ||
        nameToMesh.get(`Circular sulcus of insula.${side}`);
      const geo = new THREE.BoxGeometry(0.012, 0.09, 0.12);
      const mat = new THREE.MeshStandardMaterial({
        color: REGION_COLORS.claustrum,
        emissive: REGION_COLORS.claustrum,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.55,
        roughness: 0.4,
        metalness: 0.05
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.regionId = "claustrum";
      mesh.userData.isMarker = true;
      if (putamen && insula) {
        const a = new THREE.Vector3();
        const b = new THREE.Vector3();
        putamen.getWorldPosition(a);
        insula.getWorldPosition(b);
        // midpoint in brainRoot local space
        const mid = a.clone().add(b).multiplyScalar(0.5);
        brainRoot.worldToLocal(mid);
        mesh.position.copy(mid);
        // slight lateral offset
        mesh.position.x += side === "r" ? 0.01 : -0.01;
      } else {
        mesh.position.set(side === "r" ? 0.22 : -0.22, 0.02, 0.05);
      }
      brainRoot.add(mesh);
      markers.push(mesh);
      allPickable.push(mesh);
    });
    regionMeshes.claustrum = markers;
  }

  function styleMeshAsBrainTissue(mesh, category) {
    storeBase(mesh);
    const mat = mesh.material;
    if (!mat) return;
    mat.roughness = 0.72;
    mat.metalness = 0.05;
    mat.transparent = true;
    mat.opacity = NORMAL_OPACITY;
    mat.side = THREE.FrontSide;
    if (category === "cortex" || category === "cerebellum") {
      mat.color.setHex(BASE_COLOR);
      if (mat.emissive) mat.emissive.setHex(BASE_EMISSIVE);
      mat.emissiveIntensity = 0.12;
    } else if (category === "brainstem" || category === "diencephalon") {
      mat.color.setHex(0xc48989);
      if (mat.emissive) mat.emissive.setHex(0x1a1010);
      mat.emissiveIntensity = 0.1;
    } else if (category === "deep_grey") {
      mat.color.setHex(0xb87890);
      if (mat.emissive) mat.emissive.setHex(0x150810);
      mat.emissiveIntensity = 0.08;
    } else {
      mat.color.setHex(0xc9a0a0);
    }
    // refresh stored base after styling
    baseMaterials.set(mesh, {
      color: mat.color.clone(),
      emissive: mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000),
      opacity: mat.opacity,
      emissiveIntensity: mat.emissiveIntensity || 0
    });
  }

  function assignRegions() {
    REGION_IDS.forEach((id) => {
      regionMeshes[id] = [];
    });
    const regions = (regionMap && regionMap.regions) || {};
    Object.keys(regions).forEach((id) => {
      (regions[id] || []).forEach((name) => {
        const mesh = nameToMesh.get(name);
        if (mesh) {
          mesh.userData.regionId = id;
          regionMeshes[id].push(mesh);
          if (!allPickable.includes(mesh)) allPickable.push(mesh);
        }
      });
    });
  }

  async function loadBrain() {
    const b = B();
    setLoading(b.loading || "Loading anatomical brain…");

    const [mapRes] = await Promise.all([
      fetch("assets/brain/region-map.json").then((r) => r.json())
    ]);
    regionMap = mapRes;

    // Build name -> category from manifest if available
    let nameCategory = {};
    try {
      const man = await fetch("assets/brain/manifest.json").then((r) => r.json());
      (man.nodes || []).forEach((n) => {
        nameCategory[n.name] = n.category;
      });
    } catch (_) {}

    const draco = new DRACOLoader();
    draco.setDecoderPath("assets/brain/draco/gltf/");
    draco.preload();

    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    const gltf = await new Promise((resolve, reject) => {
      loader.load(
        "assets/brain/brain.glb",
        resolve,
        (ev) => {
          if (ev.total) {
            const pct = Math.round((ev.loaded / ev.total) * 100);
            setLoading((b.loadingProgress || "Loading brain… {pct}%").replace("{pct}", String(pct)));
          }
        },
        reject
      );
    });

    brainRoot = new THREE.Group();
    brainRoot.name = "brainRoot";
    scene.add(brainRoot);

    const hidden = new Set(
      (regionMap && regionMap.hiddenCategories) || [
        "arteries",
        "veins_sinuses",
        "cranial_nerves",
        "tracts",
        "ventricles",
        "meninges_dura"
      ]
    );
    const visibleCats = new Set(
      (regionMap && regionMap.visibleCategories) || [
        "cortex",
        "cerebellum",
        "brainstem",
        "diencephalon",
        "deep_grey",
        "white_matter"
      ]
    );

    gltf.scene.traverse((obj) => {
      if (!obj.isMesh) return;
      const name = obj.name || "";
      const cat = nameCategory[name] || "other";
      // Hide noisy systems for clarity + performance
      if (hidden.has(cat) || (!visibleCats.has(cat) && cat !== "other")) {
        obj.visible = false;
        return;
      }
      // Skip unnamed misc if not in visible
      if (cat === "other" && !visibleCats.has(cat)) {
        obj.visible = false;
        return;
      }
      obj.castShadow = false;
      obj.receiveShadow = false;
      obj.frustumCulled = true;
      if (Array.isArray(obj.material)) {
        obj.material = obj.material[0];
      }
      styleMeshAsBrainTissue(obj, cat);
      nameToMesh.set(name, obj);
      // reparent under brainRoot while keeping world transform
      brainRoot.attach(obj);
    });

    // Drop empty leftover from gltf
    if (gltf.scene.parent) gltf.scene.parent.remove(gltf.scene);

    assignRegions();
    buildClaustrumMarkers();
    fitCameraToObject(brainRoot);

    // Slight anatomical orientation: superior up, frontal toward +Z preference
    brainRoot.rotation.x = -0.15;
    brainRoot.rotation.z = 0;

    setLoading(null);
    renderChips();
    showDetail("hotzone");
  }

  function onPointer(e) {
    if (!renderer || !camera) return;
    const rect = renderer.domElement.getBoundingClientRect();
    const clientX = e.clientX != null ? e.clientX : e.touches && e.touches[0].clientX;
    const clientY = e.clientY != null ? e.clientY : e.touches && e.touches[0].clientY;
    if (clientX == null) return;
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(allPickable, false);
    if (hits.length) {
      const id = hits[0].object.userData.regionId;
      if (id) showDetail(id);
    }
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    if (!reducedMotion && autoSpin) {
      rotY += 0.0022;
    }
    if (controlsProxy) controlsProxy.update();
    renderer.render(scene, camera);
  }

  function onResize() {
    if (!container || !camera || !renderer) return;
    const w = container.clientWidth;
    const h = Math.max(280, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function initThree() {
    if (starting || inited) return;
    starting = true;

    if (typeof WebGLRenderingContext === "undefined") {
      const b = B();
      if (detailEl) {
        detailEl.innerHTML = `<p class="brain-hint">${escapeHtml(
          b.webglFail || "WebGL unavailable — use region chips below."
        )}</p>`;
      }
      renderChips();
      showDetail("thalamus");
      starting = false;
      return;
    }

    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scene = new THREE.Scene();
    const w = container.clientWidth;
    const h = Math.max(360, Math.min(560, window.innerHeight * 0.5));
    container.style.height = h + "px";
    camera = new THREE.PerspectiveCamera(40, w / h, 0.01, 100);
    camera.position.set(0, 0.35, camDist);

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
    } catch (err) {
      const b = B();
      if (detailEl) {
        detailEl.innerHTML = `<p class="brain-hint">${escapeHtml(
          b.webglFail || "WebGL failed — use region chips below."
        )}</p>`;
      }
      renderChips();
      showDetail("thalamus");
      starting = false;
      return;
    }

    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff0f5, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(2.5, 3.5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xa8c4ff, 0.45);
    fill.position.set(-3, 0.5, -2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffc6d9, 0.35);
    rim.position.set(0, -2, -3);
    scene.add(rim);

    raycaster = new THREE.Raycaster();
    // denser picking on complex mesh
    raycaster.params.Mesh = raycaster.params.Mesh || {};
    pointer = new THREE.Vector2();

    controlsProxy = {
      update() {
        camera.position.x = Math.sin(rotY) * Math.cos(rotX) * camDist;
        camera.position.y = Math.sin(rotX) * camDist + 0.05;
        camera.position.z = Math.cos(rotY) * Math.cos(rotX) * camDist;
        camera.lookAt(0, 0, 0);
      }
    };
    controlsProxy.update();

    const el = renderer.domElement;
    el.style.touchAction = "none";
    let dragging = false;
    let moved = false;
    let prevX = 0;
    let prevY = 0;
    el.addEventListener("pointerdown", (e) => {
      dragging = true;
      moved = false;
      autoSpin = false;
      prevX = e.clientX;
      prevY = e.clientY;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      prevX = e.clientX;
      prevY = e.clientY;
      rotY += dx * 0.008;
      rotX = Math.max(-1.0, Math.min(1.2, rotX + dy * 0.008));
    });
    el.addEventListener("pointerup", (e) => {
      dragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch (_) {}
      if (!moved) onPointer(e);
    });
    el.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        camDist = Math.max(1.2, Math.min(5.5, camDist + e.deltaY * 0.002));
      },
      { passive: false }
    );

    window.addEventListener("resize", onResize);
    renderChips();
    animate();

    loadBrain()
      .then(() => {
        inited = true;
        starting = false;
      })
      .catch((err) => {
        console.error("Brain load failed", err);
        const b = B();
        setLoading(null);
        if (detailEl) {
          detailEl.innerHTML = `<p class="brain-hint">${escapeHtml(
            b.loadFail || "Could not load the 3D brain model. Use the chips below."
          )}</p>`;
        }
        renderChips();
        showDetail("thalamus");
        starting = false;
        inited = true;
      });
  }

  function init() {
    container = document.getElementById("brain-canvas");
    detailEl = document.getElementById("brain-detail");
    chipBox = document.getElementById("brain-chips");
    loadingEl = document.getElementById("brain-loading");
    if (!container) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !inited && !starting) {
          initThree();
          io.disconnect();
        }
      },
      { rootMargin: "160px" }
    );
    io.observe(container);
    renderChips();
    if (detailEl && !selected) {
      const b = B();
      detailEl.innerHTML = `<p class="brain-hint">${escapeHtml(b.hint)}</p>`;
    }
  }

  window.ConsciousnessBrain = { init, onLangChange };
})();

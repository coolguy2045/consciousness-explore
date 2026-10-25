/* Interactive anatomical 3D brain — GLB atlas + reliable fallback */
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

  const BASE_COLOR = 0xe8b4b8;
  const DEFAULT_HIDDEN = [
    "arteries",
    "veins_sinuses",
    "cranial_nerves",
    "tracts",
    "ventricles",
    "meninges_dura"
  ];
  const DEFAULT_VISIBLE = [
    "cortex",
    "cerebellum",
    "brainstem",
    "diencephalon",
    "deep_grey",
    "white_matter"
  ];

  let renderer, scene, camera, controlsProxy, animId, selected = null;
  let raycaster, pointer;
  let container, detailEl, chipBox, loadingEl;
  let inited = false;
  let starting = false;
  let reducedMotion = false;
  let brainRoot = null;
  let regionMeshes = {};
  let allPickable = [];
  let nameToMesh = new Map();
  let regionMap = null;
  let baseMaterials = new WeakMap();
  let autoSpin = true;
  let rotY = 0.55;
  let rotX = 0.18;
  let camDist = 2.4;
  let camDistMin = 0.8;
  let camDistMax = 6;
  let usingFallback = false;

  function lang() {
    return document.documentElement.getAttribute("data-lang") || "zh";
  }
  function B() {
    return window.t(lang()).brain;
  }

  /** Resolve site assets relative to this module (works on /consciousness-explore/). */
  function assetUrl(relFromSiteRoot) {
    return new URL("../" + relFromSiteRoot.replace(/^\//, ""), import.meta.url).href;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setLoading(msg, isError) {
    if (!loadingEl) return;
    if (!msg) {
      loadingEl.hidden = true;
      loadingEl.textContent = "";
      loadingEl.classList.remove("is-error");
      return;
    }
    loadingEl.hidden = false;
    loadingEl.classList.toggle("is-error", !!isError);
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
    if (!mat.userData || !mat.userData._brainCloned) {
      mesh.material = mat.clone();
      mesh.material.userData = { ...(mat.userData || {}), _brainCloned: true };
    }
    const m = mesh.material;
    baseMaterials.set(mesh, {
      color: m.color ? m.color.clone() : new THREE.Color(BASE_COLOR),
      emissive: m.emissive ? m.emissive.clone() : new THREE.Color(0x000000),
      opacity: m.opacity != null ? m.opacity : 1,
      emissiveIntensity: m.emissiveIntensity != null ? m.emissiveIntensity : 0.15,
      transparent: !!m.transparent
    });
  }

  function applyHighlight(id) {
    const activeSet = new Set(regionMeshes[id] || []);
    nameToMesh.forEach((mesh) => {
      storeBase(mesh);
      const base = baseMaterials.get(mesh);
      const mat = mesh.material;
      if (!mat || !base) return;
      const isActive = activeSet.has(mesh);
      if (selected && !isActive) {
        mat.color.copy(base.color).multiplyScalar(0.4);
        if (mat.emissive) mat.emissive.setHex(0x000000);
        mat.opacity = usingFallback ? 0.35 : 0.22;
        mat.transparent = true;
        mat.emissiveIntensity = 0;
      } else if (isActive) {
        const c = REGION_COLORS[id] || 0xffffff;
        mat.color.setHex(c);
        if (mat.emissive) mat.emissive.setHex(c);
        mat.emissiveIntensity = 0.55;
        mat.opacity = 1;
        mat.transparent = false;
      } else {
        mat.color.copy(base.color);
        if (mat.emissive) mat.emissive.copy(base.emissive);
        mat.emissiveIntensity = base.emissiveIntensity;
        mat.opacity = base.opacity;
        mat.transparent = base.transparent;
      }
      mat.needsUpdate = true;
    });
    (regionMeshes.claustrum || []).forEach((mesh) => {
      const mat = mesh.material;
      if (!mat) return;
      const on = id === "claustrum";
      mat.emissiveIntensity = on ? 0.85 : 0.2;
      mat.opacity = on ? 1 : 0.7;
      mat.transparent = !on;
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
      setLoading(
        loadingEl.classList.contains("is-error")
          ? b.loadFail || "Load failed"
          : b.loading || "Loading…",
        loadingEl.classList.contains("is-error")
      );
    }
  }

  function fitCameraToObject(object) {
    object.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) return false;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);
    object.updateMatrixWorld(true);
    const maxDim = Math.max(size.x, size.y, size.z, 0.05);
    camDist = maxDim * 1.75;
    camDistMin = maxDim * 0.85;
    camDistMax = maxDim * 4.5;
    if (camera) {
      camera.near = Math.max(0.001, maxDim / 200);
      camera.far = Math.max(50, maxDim * 40);
      camera.updateProjectionMatrix();
    }
    if (controlsProxy) controlsProxy.update();
    return true;
  }

  function styleMeshAsBrainTissue(mesh, category) {
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material[0];
    }
    if (!mesh.material) {
      mesh.material = new THREE.MeshStandardMaterial({ color: BASE_COLOR });
    } else {
      mesh.material = mesh.material.clone();
    }
    const mat = mesh.material;
    mat.userData = { ...(mat.userData || {}), _brainCloned: true };
    mat.roughness = 0.78;
    mat.metalness = 0.04;
    mat.transparent = false;
    mat.opacity = 1;
    mat.depthWrite = true;
    mat.side = THREE.FrontSide;
    if (mat.map) mat.map = null;
    if (category === "cortex" || category === "cerebellum" || category === "other") {
      mat.color.setHex(BASE_COLOR);
      if (mat.emissive) {
        mat.emissive.setHex(0x2a1218);
        mat.emissiveIntensity = 0.12;
      }
    } else if (category === "brainstem" || category === "diencephalon") {
      mat.color.setHex(0xd4a0a8);
      if (mat.emissive) {
        mat.emissive.setHex(0x1a1010);
        mat.emissiveIntensity = 0.1;
      }
    } else if (category === "deep_grey") {
      mat.color.setHex(0xc47890);
      if (mat.emissive) {
        mat.emissive.setHex(0x150810);
        mat.emissiveIntensity = 0.1;
      }
    } else {
      mat.color.setHex(0xd8b0b4);
      if (mat.emissive) mat.emissiveIntensity = 0.08;
    }
    baseMaterials.set(mesh, {
      color: mat.color.clone(),
      emissive: mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000),
      opacity: 1,
      emissiveIntensity: mat.emissiveIntensity || 0,
      transparent: false
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

  function buildClaustrumMarkers() {
    const markers = [];
    ["l", "r"].forEach((side) => {
      const putamen = nameToMesh.get(`Putamen.${side}`);
      const insula =
        nameToMesh.get(`Insula (Subcentral gyrus and ant. and post. sulci*).${side}`) ||
        nameToMesh.get(`Circular sulcus of insula.${side}`);
      const geo = new THREE.BoxGeometry(0.01, 0.08, 0.1);
      const mat = new THREE.MeshStandardMaterial({
        color: REGION_COLORS.claustrum,
        emissive: REGION_COLORS.claustrum,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.7,
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
        const mid = a.clone().add(b).multiplyScalar(0.5);
        brainRoot.worldToLocal(mid);
        mesh.position.copy(mid);
        mesh.position.x += side === "r" ? 0.01 : -0.01;
      } else {
        mesh.position.set(side === "r" ? 0.2 : -0.2, 0.02, 0.04);
      }
      brainRoot.add(mesh);
      markers.push(mesh);
      allPickable.push(mesh);
    });
    regionMeshes.claustrum = markers;
  }

  /** Recognizable stylized brain if GLB fails — still region-pickable. */
  function buildFallbackBrain() {
    usingFallback = true;
    brainRoot = new THREE.Group();
    brainRoot.name = "brainRootFallback";
    scene.add(brainRoot);

    function hemiMat(hex) {
      return new THREE.MeshStandardMaterial({
        color: hex,
        roughness: 0.75,
        metalness: 0.05,
        emissive: 0x1a0c10,
        emissiveIntensity: 0.12
      });
    }

    function addMesh(geo, mat, pos, scale, rot, regionId, key) {
      const mesh = new THREE.Mesh(geo, mat);
      if (pos) mesh.position.set(pos[0], pos[1], pos[2]);
      if (scale) mesh.scale.set(scale[0], scale[1], scale[2]);
      if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
      mesh.userData.regionId = regionId;
      brainRoot.add(mesh);
      if (key) nameToMesh.set(key, mesh);
      if (regionId) {
        if (!regionMeshes[regionId]) regionMeshes[regionId] = [];
        regionMeshes[regionId].push(mesh);
        allPickable.push(mesh);
      }
      storeBase(mesh);
      return mesh;
    }

    REGION_IDS.forEach((id) => {
      regionMeshes[id] = [];
    });

    // Hemispheres
    const hemiGeo = new THREE.SphereGeometry(0.55, 48, 36);
    addMesh(hemiGeo, hemiMat(0xe8b4b8), [-0.32, 0.15, 0], [1.05, 0.95, 1.15], [0.1, 0, 0.08], "pfc", "hemiL");
    addMesh(hemiGeo.clone(), hemiMat(0xe4aeb4), [0.32, 0.15, 0], [1.05, 0.95, 1.15], [0.1, 0, -0.08], "hotzone", "hemiR");

    // Frontal bulge (PFC)
    addMesh(new THREE.SphereGeometry(0.28, 24, 18), hemiMat(0x67e8f9),
      [0, 0.22, 0.42],
      [1.35, 0.85, 0.7],
      [0.2, 0, 0],
      "pfc",
      "frontal"
    );

    // Posterior hot zone
    addMesh(new THREE.SphereGeometry(0.3, 24, 18), hemiMat(0xa78bfa),
      [0, 0.18, -0.45],
      [1.2, 0.9, 0.75],
      [-0.15, 0, 0],
      "hotzone",
      "posterior"
    );

    // Cerebellum
    addMesh(new THREE.SphereGeometry(0.32, 24, 16), hemiMat(0xd4a0a8),
      [0, -0.28, -0.35],
      [1.3, 0.7, 0.9],
      [0.4, 0, 0],
      "dmn",
      "cerebellum"
    );

    // Brainstem
    addMesh(new THREE.CylinderGeometry(0.08, 0.11, 0.45, 16), hemiMat(0xfb923c),
      [0, -0.45, -0.05],
      [1, 1, 1],
      [0.35, 0, 0],
      "brainstem",
      "brainstem"
    );

    // Thalamus (deep)
    addMesh(new THREE.SphereGeometry(0.14, 16, 12), hemiMat(0xf472b6),
      [0, 0.02, 0],
      [1.2, 0.85, 1.1],
      null,
      "thalamus",
      "thalamus"
    );

    // Insula approx lateral
    addMesh(new THREE.SphereGeometry(0.12, 14, 12), hemiMat(0xe879f9),
      [0.38, 0.05, 0.08],
      [0.5, 0.9, 1.1],
      null,
      "insula",
      "insulaR"
    );
    addMesh(new THREE.SphereGeometry(0.12, 14, 12), hemiMat(0xe879f9),
      [-0.38, 0.05, 0.08],
      [0.5, 0.9, 1.1],
      null,
      "insula",
      "insulaL"
    );

    // ACC midline
    addMesh(new THREE.TorusGeometry(0.22, 0.05, 10, 24, Math.PI), hemiMat(0x38bdf8),
      [0, 0.2, 0.1],
      [0.7, 1, 1],
      [Math.PI / 2, 0, 0],
      "acc",
      "acc"
    );

    // DMN medial posterior
    addMesh(new THREE.SphereGeometry(0.14, 14, 12), hemiMat(0x6ee7b7),
      [0, 0.05, -0.2],
      [0.9, 0.8, 0.7],
      null,
      "dmn",
      "dmn"
    );

    // Claustrum markers
    ["l", "r"].forEach((side) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.14, 0.16),
        new THREE.MeshStandardMaterial({
          color: REGION_COLORS.claustrum,
          emissive: REGION_COLORS.claustrum,
          emissiveIntensity: 0.25,
          transparent: true,
          opacity: 0.75
        })
      );
      mesh.position.set(side === "r" ? 0.28 : -0.28, 0.05, 0.05);
      mesh.userData.regionId = "claustrum";
      brainRoot.add(mesh);
      regionMeshes.claustrum.push(mesh);
      allPickable.push(mesh);
      storeBase(mesh);
    });

    // Sulcus grooves (visual cue)
    for (let i = 0; i < 6; i++) {
      const g = new THREE.Mesh(
        new THREE.TorusGeometry(0.42 + i * 0.02, 0.012, 6, 32, Math.PI * 1.2),
        new THREE.MeshStandardMaterial({ color: 0xb07078, roughness: 0.9, metalness: 0 })
      );
      g.position.set(i % 2 === 0 ? -0.2 : 0.2, 0.2, 0.05);
      g.rotation.set(0.6, i * 0.3, i % 2 === 0 ? 0.4 : -0.4);
      brainRoot.add(g);
    }

    fitCameraToObject(brainRoot);
    return brainRoot.children.filter((c) => c.isMesh).length;
  }

  async function loadBrain() {
    const b = B();
    setLoading(b.loading || "Loading anatomical brain…");

    nameToMesh = new Map();
    allPickable = [];
    regionMeshes = {};
    usingFallback = false;

    let nameCategory = {};
    try {
      const [mapRes, manRes] = await Promise.all([
        fetch(assetUrl("assets/brain/region-map.json")).then((r) => {
          if (!r.ok) throw new Error("region-map " + r.status);
          return r.json();
        }),
        fetch(assetUrl("assets/brain/manifest.json")).then((r) => {
          if (!r.ok) throw new Error("manifest " + r.status);
          return r.json();
        })
      ]);
      regionMap = mapRes;
      (manRes.nodes || []).forEach((n) => {
        nameCategory[n.name] = n.category;
      });
    } catch (err) {
      console.warn("Brain metadata fetch failed", err);
      regionMap = {
        visibleCategories: DEFAULT_VISIBLE,
        hiddenCategories: DEFAULT_HIDDEN,
        regions: {}
      };
      nameCategory = null; // signal: cannot classify meshes
    }

    const hidden = new Set(
      (regionMap && regionMap.hiddenCategories) || DEFAULT_HIDDEN
    );
    const visibleCats = new Set(
      (regionMap && regionMap.visibleCategories) || DEFAULT_VISIBLE
    );

    const draco = new DRACOLoader();
    draco.setDecoderPath(assetUrl("assets/brain/draco/gltf/"));
    draco.preload();

    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    let gltf;
    try {
      gltf = await new Promise((resolve, reject) => {
        loader.load(
          assetUrl("assets/brain/brain.glb"),
          resolve,
          (ev) => {
            if (ev.total) {
              const pct = Math.round((ev.loaded / ev.total) * 100);
              setLoading(
                (b.loadingProgress || "Loading brain… {pct}%").replace(
                  "{pct}",
                  String(pct)
                )
              );
            }
          },
          reject
        );
      });
    } catch (err) {
      console.error("GLB load failed", err);
      const n = buildFallbackBrain();
      if (n < 1) throw err;
      setLoading(null);
      renderChips();
      showDetail("hotzone");
      if (detailEl) {
        const note = document.createElement("p");
        note.className = "brain-note";
        note.textContent = b.fallbackNote || "";
        detailEl.appendChild(note);
      }
      return;
    }

    if (!nameCategory || typeof nameCategory !== "object" || Object.keys(nameCategory).length < 50) {
      console.warn("Missing mesh categories; using stylized fallback brain");
      buildFallbackBrain();
      setLoading(null);
      renderChips();
      showDetail("hotzone");
      return;
    }

    brainRoot = new THREE.Group();
    brainRoot.name = "brainRoot";
    scene.add(brainRoot);

    // CRITICAL: collect meshes first — never attach/reparent inside traverse
    const meshes = [];
    gltf.scene.updateMatrixWorld(true);
    gltf.scene.traverse((obj) => {
      if (obj.isMesh) meshes.push(obj);
    });

    let visibleCount = 0;
    meshes.forEach((obj) => {
      const name = obj.name || "";
      let cat = nameCategory[name] || "other";

      // Only hide known noisy systems. Unknown/"other" stay visible as cortex-like.
      if (hidden.has(cat)) {
        obj.visible = false;
        return;
      }
      if (cat !== "other" && !visibleCats.has(cat) && !hidden.has(cat)) {
        // categories outside both lists → still show rather than blank canvas
        cat = "other";
      }

      obj.visible = true;
      obj.castShadow = false;
      obj.receiveShadow = false;
      obj.frustumCulled = true;
      styleMeshAsBrainTissue(obj, cat);
      nameToMesh.set(name, obj);

      // Reparent after collection (safe)
      brainRoot.attach(obj);
      visibleCount++;
    });

    if (visibleCount < 8) {
      console.warn("Too few visible meshes (" + visibleCount + "), using fallback");
      scene.remove(brainRoot);
      nameToMesh = new Map();
      allPickable = [];
      regionMeshes = {};
      buildFallbackBrain();
    } else {
      assignRegions();
      buildClaustrumMarkers();
      const ok = fitCameraToObject(brainRoot);
      if (!ok) {
        scene.remove(brainRoot);
        buildFallbackBrain();
      } else {
        brainRoot.rotation.x = -0.12;
      }
    }

    const finalVisible = [];
    brainRoot.traverse((o) => {
      if (o.isMesh && o.visible) finalVisible.push(o);
    });
    if (finalVisible.length < 1) {
      throw new Error("No visible brain meshes after load");
    }

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
    if (renderer && scene && camera) renderer.render(scene, camera);
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

    const b = B();
    setLoading(b.loading || "Loading…");

    if (typeof WebGLRenderingContext === "undefined") {
      setLoading(b.webglFail || "WebGL unavailable", true);
      renderChips();
      showDetail("thalamus");
      starting = false;
      inited = true;
      return;
    }

    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scene = new THREE.Scene();
    const w = Math.max(280, container.clientWidth || container.parentElement.clientWidth || 480);
    const h = Math.max(360, Math.min(560, window.innerHeight * 0.5));
    container.style.height = h + "px";
    camera = new THREE.PerspectiveCamera(40, w / h, 0.01, 200);
    camera.position.set(0, 0.35, camDist);

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
    } catch (err) {
      setLoading(b.webglFail || "WebGL failed", true);
      renderChips();
      showDetail("thalamus");
      starting = false;
      inited = true;
      return;
    }

    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff5f8, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(2.5, 3.5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xa8c4ff, 0.55);
    fill.position.set(-3, 0.5, -2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffc6d9, 0.4);
    rim.position.set(0, -2, -3);
    scene.add(rim);

    raycaster = new THREE.Raycaster();
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
        camDist = Math.max(camDistMin, Math.min(camDistMax, camDist + e.deltaY * 0.0025));
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
        try {
          if (brainRoot) scene.remove(brainRoot);
          nameToMesh = new Map();
          allPickable = [];
          regionMeshes = {};
          buildFallbackBrain();
          setLoading(null);
          renderChips();
          showDetail("thalamus");
        } catch (e2) {
          setLoading(b.loadFail || "Could not load the 3D brain model.", true);
          renderChips();
          showDetail("thalamus");
        }
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
    // Show loading hint immediately
    const b = B();
    if (loadingEl) {
      setLoading(b.loading || "Loading…");
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !inited && !starting) {
          initThree();
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(container);
    renderChips();
    if (detailEl && !selected) {
      detailEl.innerHTML = `<p class="brain-hint">${escapeHtml(b.hint)}</p>`;
    }
  }

  window.ConsciousnessBrain = { init, onLangChange };
})();

/* Interactive 3D brain (Three.js) — simplified labeled regions */
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

  const REGION_MESH = {
    thalamus: { color: 0xf472b6, pos: [0, 0.15, -0.05], scale: [0.35, 0.28, 0.32] },
    pfc: { color: 0x67e8f9, pos: [0, 0.55, 0.85], scale: [0.95, 0.55, 0.55] },
    hotzone: { color: 0xa78bfa, pos: [0, 0.45, -0.95], scale: [1.05, 0.7, 0.55] },
    claustrum: { color: 0xfcd34d, pos: [0.55, 0.25, 0.15], scale: [0.12, 0.35, 0.55] },
    brainstem: { color: 0xfb923c, pos: [0, -0.75, -0.15], scale: [0.28, 0.55, 0.28] },
    dmn: { color: 0x6ee7b7, pos: [0, 0.35, -0.35], scale: [0.55, 0.4, 0.45] },
    acc: { color: 0x38bdf8, pos: [0, 0.55, 0.35], scale: [0.25, 0.35, 0.55] },
    insula: { color: 0xe879f9, pos: [-0.7, 0.2, 0.1], scale: [0.22, 0.4, 0.45] }
  };

  let renderer, scene, camera, controlsProxy, animId, selected = null;
  let meshes = {};
  let raycaster, pointer;
  let container, detailEl, chipBox;
  let inited = false;
  let reducedMotion = false;

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
    Object.keys(meshes).forEach((k) => {
      const m = meshes[k];
      if (!m) return;
      const base = REGION_MESH[k].color;
      m.material.emissive.setHex(k === id ? 0x444466 : 0x000000);
      m.material.opacity = k === id ? 0.95 : 0.72;
      m.scale.set(
        REGION_MESH[k].scale[0] * (k === id ? 1.08 : 1),
        REGION_MESH[k].scale[1] * (k === id ? 1.08 : 1),
        REGION_MESH[k].scale[2] * (k === id ? 1.08 : 1)
      );
    });
    if (chipBox) {
      chipBox.querySelectorAll(".brain-chip").forEach((c) => {
        c.setAttribute("aria-pressed", c.dataset.region === id ? "true" : "false");
      });
    }
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
  }

  function buildShell() {
    // Outer brain envelope (low-poly ellipsoid)
    const geo = new THREE.SphereGeometry(1.35, 24, 16);
    geo.scale(1.05, 0.85, 1.25);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x2a2450,
      transparent: true,
      opacity: 0.22,
      roughness: 0.65,
      metalness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const shell = new THREE.Mesh(geo, mat);
    scene.add(shell);

    // Subtle wireframe
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.12 })
    );
    scene.add(wire);
  }

  function buildRegions() {
    REGION_IDS.forEach((id) => {
      const cfg = REGION_MESH[id];
      const geo = new THREE.SphereGeometry(1, 16, 12);
      geo.scale(cfg.scale[0], cfg.scale[1], cfg.scale[2]);
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.72,
        roughness: 0.45,
        metalness: 0.15,
        emissive: 0x000000
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      mesh.userData.regionId = id;
      scene.add(mesh);
      meshes[id] = mesh;
    });
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
    const hits = raycaster.intersectObjects(Object.values(meshes), false);
    if (hits.length) {
      showDetail(hits[0].object.userData.regionId);
    }
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    if (!reducedMotion && scene) {
      scene.rotation.y += 0.003;
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
    if (typeof THREE === "undefined") {
      if (detailEl) {
        detailEl.innerHTML =
          '<p class="brain-hint">Three.js failed to load. Use the region chips below.</p>';
      }
      renderChips();
      showDetail("thalamus");
      return;
    }
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scene = new THREE.Scene();
    const w = container.clientWidth;
    const h = Math.max(320, Math.min(480, window.innerHeight * 0.45));
    container.style.height = h + "px";
    camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 1.2, 4.2);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const amb = new THREE.AmbientLight(0xb8b0ff, 0.75);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 0.85);
    dir.position.set(3, 4, 5);
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0x67e8f9, 0.25);
    fill.position.set(-3, -1, -2);
    scene.add(fill);

    buildShell();
    buildRegions();

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    // Simple orbit via drag
    let dragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotY = 0.4;
    let rotX = 0.15;
    controlsProxy = {
      update() {
        camera.position.x = Math.sin(rotY) * Math.cos(rotX) * 4.2;
        camera.position.y = Math.sin(rotX) * 4.2 + 0.4;
        camera.position.z = Math.cos(rotY) * Math.cos(rotX) * 4.2;
        camera.lookAt(0, 0.1, 0);
      }
    };
    controlsProxy.update();

    const el = renderer.domElement;
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", (e) => {
      dragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      rotY += dx * 0.008;
      rotX = Math.max(-0.6, Math.min(0.85, rotX + dy * 0.008));
    });
    el.addEventListener("pointerup", (e) => {
      dragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch (_) {}
    });
    el.addEventListener("click", onPointer);

    window.addEventListener("resize", onResize);
    renderChips();
    showDetail("hotzone");
    animate();
    inited = true;
  }

  function init() {
    container = document.getElementById("brain-canvas");
    detailEl = document.getElementById("brain-detail");
    chipBox = document.getElementById("brain-chips");
    if (!container) return;
    // Lazy-init when section near viewport
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !inited) {
          initThree();
          io.disconnect();
        }
      },
      { rootMargin: "120px" }
    );
    io.observe(container);
    // Fallback chips always available after first apply
    renderChips();
    if (detailEl && !selected) {
      const b = B();
      detailEl.innerHTML = `<p class="brain-hint">${escapeHtml(b.hint)}</p>`;
    }
  }

  window.ConsciousnessBrain = { init, onLangChange };
})();

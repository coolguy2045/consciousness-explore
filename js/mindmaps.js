/* Interactive SVG mindmaps — pan/zoom + expandable nodes */
(function () {
  const MAP_IDS = ["map-bridge", "map-unconscious", "map-practice"];

  function lang() {
    return document.documentElement.getAttribute("data-lang") || "zh";
  }
  function M() {
    return window.t(lang()).mindmaps;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function layoutRadial(root, cx, cy, radius) {
    // root: { id, label, children: [...] }
    const nodes = [];
    const links = [];
    nodes.push({ id: root.id, label: root.label, x: cx, y: cy, depth: 0, open: true });

    function place(parent, items, depth, startAngle, endAngle, r) {
      if (!items || !items.length) return;
      const n = items.length;
      const span = endAngle - startAngle;
      items.forEach((item, i) => {
        const a = startAngle + (span * (i + 0.5)) / n;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        nodes.push({
          id: item.id,
          label: item.label,
          x,
          y,
          depth,
          open: depth < 2,
          parent: parent.id,
          children: item.children || []
        });
        links.push({ from: parent.id, to: item.id });
        if (item.children && item.children.length && depth < 3) {
          const childSpan = span / n;
          const a0 = startAngle + childSpan * i;
          const a1 = a0 + childSpan;
          place(item, item.children, depth + 1, a0, a1, r + radius * 0.55);
        }
      });
    }

    place(root, root.children || [], 1, -Math.PI * 0.75, Math.PI * 1.25, radius);
    return { nodes, links };
  }

  function createMap(container, mapKey) {
    let data = M()[mapKey];
    if (!data) return null;
    data = JSON.parse(JSON.stringify(data));

    const W = 900;
    const H = 640;
    const state = { scale: 1, tx: 0, ty: 0, dragging: false, px: 0, py: 0 };

    container.innerHTML = "";
    container.classList.add("mindmap-viewport");

    const toolbar = document.createElement("div");
    toolbar.className = "mindmap-toolbar";
    toolbar.innerHTML =
      `<button type="button" class="btn btn-ghost mm-zoom-in" aria-label="Zoom in">+</button>` +
      `<button type="button" class="btn btn-ghost mm-zoom-out" aria-label="Zoom out">−</button>` +
      `<button type="button" class="btn btn-ghost mm-reset" data-i18n-mm-reset>Reset</button>`;
    container.appendChild(toolbar);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", data.title);
    svg.classList.add("mindmap-svg");
    container.appendChild(svg);

    const gRoot = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gRoot.classList.add("mm-world");
    svg.appendChild(gRoot);

    const gLinks = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const gNodes = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gRoot.appendChild(gLinks);
    gRoot.appendChild(gNodes);

    let collapsed = {};

    function visibleTree() {
      function filter(node, depth) {
        const copy = { id: node.id, label: node.label, children: [] };
        if (collapsed[node.id]) return copy;
        (node.children || []).forEach((c) => {
          copy.children.push(filter(c, depth + 1));
        });
        return copy;
      }
      return filter(data.root, 0);
    }

    function applyTransform() {
      gRoot.setAttribute(
        "transform",
        `translate(${state.tx} ${state.ty}) scale(${state.scale})`
      );
    }

    function draw() {
      const tree = visibleTree();
      const { nodes, links } = layoutRadial(tree, W / 2, H / 2, 150);
      gLinks.innerHTML = "";
      gNodes.innerHTML = "";
      const byId = {};
      nodes.forEach((n) => (byId[n.id] = n));

      links.forEach((L) => {
        const a = byId[L.from];
        const b = byId[L.to];
        if (!a || !b) return;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", a.x);
        line.setAttribute("y1", a.y);
        line.setAttribute("x2", b.x);
        line.setAttribute("y2", b.y);
        line.setAttribute("class", "mm-link");
        gLinks.appendChild(line);
      });

      nodes.forEach((n) => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "mm-node depth-" + n.depth);
        g.setAttribute("transform", `translate(${n.x} ${n.y})`);
        g.style.cursor = "pointer";

        const hasKids =
          (n.children && n.children.length) ||
          (function find(node) {
            if (node.id === n.id) return (node.children || []).length > 0;
            return (node.children || []).some(find);
          })(data.root);

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const label = n.label || "";
        const tw = Math.min(200, Math.max(72, label.length * (lang() === "zh" ? 14 : 7.2) + 24));
        const th = n.depth === 0 ? 40 : 32;
        rect.setAttribute("x", -tw / 2);
        rect.setAttribute("y", -th / 2);
        rect.setAttribute("width", tw);
        rect.setAttribute("height", th);
        rect.setAttribute("rx", 10);
        rect.setAttribute("class", n.depth === 0 ? "mm-pill root" : "mm-pill");
        g.appendChild(rect);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("class", "mm-label");
        text.textContent = label.length > 28 ? label.slice(0, 26) + "…" : label;
        g.appendChild(text);

        if (hasKids && n.depth > 0) {
          const badge = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          badge.setAttribute("cx", tw / 2 - 6);
          badge.setAttribute("cy", -th / 2 + 6);
          badge.setAttribute("r", 5);
          badge.setAttribute("class", collapsed[n.id] ? "mm-badge closed" : "mm-badge");
          g.appendChild(badge);
        }

        g.addEventListener("click", (e) => {
          e.stopPropagation();
          if (hasKids && n.depth > 0) {
            collapsed[n.id] = !collapsed[n.id];
            draw();
          }
        });
        gNodes.appendChild(g);
      });
      applyTransform();
    }

    toolbar.querySelector(".mm-zoom-in").addEventListener("click", () => {
      state.scale = Math.min(2.4, state.scale * 1.15);
      applyTransform();
    });
    toolbar.querySelector(".mm-zoom-out").addEventListener("click", () => {
      state.scale = Math.max(0.45, state.scale / 1.15);
      applyTransform();
    });
    toolbar.querySelector(".mm-reset").addEventListener("click", () => {
      state.scale = 1;
      state.tx = 0;
      state.ty = 0;
      collapsed = {};
      draw();
    });

    svg.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".mm-node")) return;
      state.dragging = true;
      state.px = e.clientX;
      state.py = e.clientY;
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener("pointermove", (e) => {
      if (!state.dragging) return;
      state.tx += e.clientX - state.px;
      state.ty += e.clientY - state.py;
      state.px = e.clientX;
      state.py = e.clientY;
      applyTransform();
    });
    svg.addEventListener("pointerup", (e) => {
      state.dragging = false;
      try {
        svg.releasePointerCapture(e.pointerId);
      } catch (_) {}
    });
    svg.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.92 : 1.08;
        state.scale = Math.max(0.45, Math.min(2.4, state.scale * factor));
        applyTransform();
      },
      { passive: false }
    );

    draw();
    return {
      refresh() {
        const d = M()[mapKey];
        if (!d) return;
        data = JSON.parse(JSON.stringify(d));
        toolbar.querySelector(".mm-reset").textContent = M().reset || "Reset";
        collapsed = {};
        draw();
      }
    };
  }

  const instances = {};

  function init() {
    const tabs = document.querySelectorAll(".mindmap-tab");
    const panels = document.querySelectorAll(".mindmap-panel");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("data-map");
        tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");
        panels.forEach((p) => p.classList.toggle("active", p.id === "mindmap-" + id));
      });
    });

    MAP_IDS.forEach((key) => {
      const el = document.getElementById("mindmap-canvas-" + key.replace("map-", ""));
      // ids: mindmap-canvas-bridge, unconscious, practice
    });

    const mapping = [
      ["bridge", "mapBridge"],
      ["unconscious", "mapUnconscious"],
      ["practice", "mapPractice"]
    ];
    mapping.forEach(([dom, key]) => {
      const el = document.getElementById("mindmap-canvas-" + dom);
      if (el) instances[key] = createMap(el, key);
    });

    const resetLabel = M().reset || "Reset";
    document.querySelectorAll("[data-i18n-mm-reset]").forEach((b) => {
      b.textContent = resetLabel;
    });
  }

  function onLangChange() {
    Object.values(instances).forEach((inst) => inst && inst.refresh && inst.refresh());
    const resetLabel = M().reset || "Reset";
    document.querySelectorAll("[data-i18n-mm-reset]").forEach((b) => {
      b.textContent = resetLabel;
    });
    // titles / ledes via data-i18n in apply()
  }

  window.ConsciousnessMindmaps = { init, onLangChange };
})();

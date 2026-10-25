/* Colorful interactive SVG mindmaps — category shapes, icons, curved links */
(function () {
  const CAT_STYLE = {
    root: { fill: "#fef08a", stroke: "#f59e0b", text: "#1c1917", shape: "hex", size: 1.25 },
    phil: { fill: "#c4b5fd", stroke: "#8b5cf6", text: "#1e1b4b", shape: "round", size: 1.05 },
    sci: { fill: "#67e8f9", stroke: "#0891b2", text: "#083344", shape: "rect", size: 1.05 },
    brain: { fill: "#fda4af", stroke: "#e11d48", text: "#4c0519", shape: "ellipse", size: 1 },
    link: { fill: "#bbf7d0", stroke: "#16a34a", text: "#14532d", shape: "pill", size: 0.92 },
    freud: { fill: "#fdba74", stroke: "#ea580c", text: "#7c2d12", shape: "shield", size: 1 },
    jung: { fill: "#d8b4fe", stroke: "#9333ea", text: "#3b0764", shape: "hex", size: 1 },
    cog: { fill: "#93c5fd", stroke: "#2563eb", text: "#1e3a8a", shape: "gear", size: 1 },
    phen: { fill: "#f9a8d4", stroke: "#db2777", text: "#831843", shape: "diamond", size: 1 },
    samatha: { fill: "#fde68a", stroke: "#d97706", text: "#78350f", shape: "round", size: 1 },
    vipassana: { fill: "#a5f3fc", stroke: "#0e7490", text: "#164e63", shape: "ellipse", size: 1 },
    trad: { fill: "#e9d5ff", stroke: "#7c3aed", text: "#4c1d95", shape: "hex", size: 1 },
    neuro: { fill: "#86efac", stroke: "#15803d", text: "#14532d", shape: "rect", size: 0.95 },
    default: { fill: "#e2e8f0", stroke: "#64748b", text: "#0f172a", shape: "pill", size: 0.9 }
  };

  function lang() {
    return document.documentElement.getAttribute("data-lang") || "zh";
  }
  function M() {
    return window.t(lang()).mindmaps;
  }

  function styleFor(node) {
    return CAT_STYLE[node.cat] || CAT_STYLE.default;
  }

  function layoutRadial(root, cx, cy, radius) {
    const nodes = [];
    const links = [];
    nodes.push({
      id: root.id,
      label: root.label,
      icon: root.icon,
      cat: root.cat || "root",
      x: cx,
      y: cy,
      depth: 0,
      children: root.children || []
    });

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
          icon: item.icon,
          cat: item.cat || parent.cat || "default",
          x,
          y,
          depth,
          parent: parent.id,
          children: item.children || []
        });
        links.push({
          from: parent.id,
          to: item.id,
          cat: item.cat || parent.cat || "default"
        });
        if (item.children && item.children.length && depth < 4) {
          const childSpan = span / n;
          const a0 = startAngle + childSpan * i;
          const a1 = a0 + childSpan;
          place(item, item.children, depth + 1, a0 + 0.04, a1 - 0.04, r + radius * (depth === 1 ? 0.72 : 0.58));
        }
      });
    }

    place(root, root.children || [], 1, -Math.PI * 0.82, Math.PI * 1.18, radius);
    return { nodes, links };
  }

  function appendShape(g, shape, tw, th, cls) {
    const ns = "http://www.w3.org/2000/svg";
    let el;
    if (shape === "hex") {
      const w = tw / 2;
      const h = th / 2;
      const pts = [
        [0, -h],
        [w * 0.9, -h * 0.5],
        [w * 0.9, h * 0.5],
        [0, h],
        [-w * 0.9, h * 0.5],
        [-w * 0.9, -h * 0.5]
      ]
        .map((p) => p.join(","))
        .join(" ");
      el = document.createElementNS(ns, "polygon");
      el.setAttribute("points", pts);
    } else if (shape === "diamond") {
      const w = tw / 2;
      const h = th / 2 + 4;
      el = document.createElementNS(ns, "polygon");
      el.setAttribute("points", `0,${-h} ${w},0 0,${h} ${-w},0`);
    } else if (shape === "ellipse") {
      el = document.createElementNS(ns, "ellipse");
      el.setAttribute("cx", 0);
      el.setAttribute("cy", 0);
      el.setAttribute("rx", tw / 2);
      el.setAttribute("ry", th / 2 + 2);
    } else if (shape === "shield") {
      const w = tw / 2;
      const h = th / 2;
      el = document.createElementNS(ns, "path");
      el.setAttribute(
        "d",
        `M ${-w} ${-h} L ${w} ${-h} L ${w} ${h * 0.2} Q 0 ${h + 8} ${-w} ${h * 0.2} Z`
      );
    } else if (shape === "gear" || shape === "rect") {
      el = document.createElementNS(ns, "rect");
      el.setAttribute("x", -tw / 2);
      el.setAttribute("y", -th / 2);
      el.setAttribute("width", tw);
      el.setAttribute("height", th);
      el.setAttribute("rx", shape === "gear" ? 4 : 8);
    } else if (shape === "sun") {
      el = document.createElementNS(ns, "circle");
      el.setAttribute("r", Math.max(tw, th) / 2 - 2);
    } else {
      // pill / round
      el = document.createElementNS(ns, "rect");
      el.setAttribute("x", -tw / 2);
      el.setAttribute("y", -th / 2);
      el.setAttribute("width", tw);
      el.setAttribute("height", th);
      el.setAttribute("rx", th / 2);
    }
    el.setAttribute("class", cls);
    g.appendChild(el);
    return el;
  }

  function createMap(container, mapKey) {
    let data = M()[mapKey];
    if (!data) return null;
    data = JSON.parse(JSON.stringify(data));

    const W = 980;
    const H = 700;
    const state = { scale: 1, tx: 0, ty: 0, dragging: false, px: 0, py: 0 };

    container.innerHTML = "";
    container.classList.add("mindmap-viewport");

    const legend = document.createElement("div");
    legend.className = "mm-legend";
    container.appendChild(legend);

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

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <filter id="mm-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="1" stdDeviation="2.2" flood-color="#000" flood-opacity="0.35"/>
      </filter>
      <linearGradient id="mm-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="50%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#134e4a"/>
      </linearGradient>`;
    svg.appendChild(defs);

    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("width", W);
    bg.setAttribute("height", H);
    bg.setAttribute("fill", "url(#mm-bg)");
    svg.appendChild(bg);

    // soft color blobs for memory
    [
      [180, 160, "#a78bfa", 0.18],
      [780, 180, "#22d3ee", 0.16],
      [500, 560, "#fb7185", 0.14],
      [220, 520, "#4ade80", 0.12]
    ].forEach(([cx, cy, color, op]) => {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", cx);
      c.setAttribute("cy", cy);
      c.setAttribute("r", 120);
      c.setAttribute("fill", color);
      c.setAttribute("opacity", op);
      svg.appendChild(c);
    });

    const gRoot = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gRoot.classList.add("mm-world");
    svg.appendChild(gRoot);
    const gLinks = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const gNodes = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gRoot.appendChild(gLinks);
    gRoot.appendChild(gNodes);

    let collapsed = {};

    function renderLegend() {
      const items = data.legend || [];
      legend.innerHTML = items
        .map((it) => {
          const st = CAT_STYLE[it.cat] || CAT_STYLE.default;
          return `<span class="mm-leg-item" style="--mm-fill:${st.fill};--mm-stroke:${st.stroke};--mm-text:${st.text}">
            <span class="mm-leg-swatch" data-shape="${st.shape}"></span>
            <span class="mm-leg-icon">${it.icon || ""}</span>
            <span>${it.label}</span>
          </span>`;
        })
        .join("");
    }

    function visibleTree() {
      function filter(node) {
        const copy = {
          id: node.id,
          label: node.label,
          icon: node.icon,
          cat: node.cat,
          children: []
        };
        if (collapsed[node.id]) return copy;
        (node.children || []).forEach((c) => copy.children.push(filter(c)));
        return copy;
      }
      return filter(data.root);
    }

    function applyTransform() {
      gRoot.setAttribute(
        "transform",
        `translate(${state.tx} ${state.ty}) scale(${state.scale})`
      );
    }

    function draw() {
      const tree = visibleTree();
      const { nodes, links } = layoutRadial(tree, W / 2, H / 2 - 10, 168);
      gLinks.innerHTML = "";
      gNodes.innerHTML = "";
      const byId = {};
      nodes.forEach((n) => (byId[n.id] = n));

      links.forEach((L) => {
        const a = byId[L.from];
        const b = byId[L.to];
        if (!a || !b) return;
        const st = CAT_STYLE[L.cat] || CAT_STYLE.default;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        // bow the curve outward from center
        const cx0 = W / 2;
        const cy0 = H / 2;
        const ox = mx - cx0;
        const oy = my - cy0;
        const cfx = mx + ox * 0.12;
        const cfy = my + oy * 0.12;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${a.x} ${a.y} Q ${cfx} ${cfy} ${b.x} ${b.y}`);
        path.setAttribute("class", "mm-link");
        path.setAttribute("stroke", st.stroke);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-width", a.depth === 0 ? 3.2 : 2.2);
        path.setAttribute("stroke-opacity", "0.85");
        gLinks.appendChild(path);
      });

      nodes.forEach((n) => {
        const st = styleFor(n);
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "mm-node depth-" + n.depth + " cat-" + (n.cat || "default"));
        g.setAttribute("transform", `translate(${n.x} ${n.y})`);
        g.style.cursor = "pointer";

        const hasKids = (function find(node) {
          if (node.id === n.id) return (node.children || []).length > 0;
          return (node.children || []).some(find);
        })(data.root);

        const label = n.label || "";
        const icon = n.icon ? n.icon + " " : "";
        const full = icon + label;
        const charW = lang() === "zh" ? 13 : 7.1;
        const tw =
          Math.min(230, Math.max(86, full.length * charW + 28)) * (n.depth === 0 ? 1.05 : 1) * st.size;
        const th = (n.depth === 0 ? 44 : 34) * st.size;

        const shapeEl = appendShape(g, st.shape, tw, th, "mm-pill");
        shapeEl.setAttribute("fill", st.fill);
        shapeEl.setAttribute("stroke", st.stroke);
        shapeEl.setAttribute("stroke-width", n.depth === 0 ? 3 : 2);
        shapeEl.setAttribute("filter", "url(#mm-glow)");

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("class", "mm-label");
        text.setAttribute("fill", st.text);
        text.setAttribute("font-weight", n.depth === 0 ? "700" : "600");
        text.setAttribute("font-size", n.depth === 0 ? "13.5" : "12");
        const shown = full.length > 26 ? full.slice(0, 24) + "…" : full;
        text.textContent = shown;
        g.appendChild(text);

        if (hasKids && n.depth > 0) {
          const badge = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          badge.setAttribute("cx", tw / 2 - 4);
          badge.setAttribute("cy", -th / 2 + 4);
          badge.setAttribute("r", 7);
          badge.setAttribute("fill", collapsed[n.id] ? "#f97316" : "#22c55e");
          badge.setAttribute("stroke", "#fff");
          badge.setAttribute("stroke-width", "1.5");
          g.appendChild(badge);
          const bt = document.createElementNS("http://www.w3.org/2000/svg", "text");
          bt.setAttribute("x", tw / 2 - 4);
          bt.setAttribute("y", -th / 2 + 5);
          bt.setAttribute("text-anchor", "middle");
          bt.setAttribute("dominant-baseline", "middle");
          bt.setAttribute("font-size", "10");
          bt.setAttribute("font-weight", "700");
          bt.setAttribute("fill", "#fff");
          bt.textContent = collapsed[n.id] ? "+" : "−";
          g.appendChild(bt);
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

    renderLegend();
    draw();
    return {
      refresh() {
        const d = M()[mapKey];
        if (!d) return;
        data = JSON.parse(JSON.stringify(d));
        toolbar.querySelector(".mm-reset").textContent = M().reset || "Reset";
        collapsed = {};
        renderLegend();
        draw();
      }
    };
  }

  const instances = {};

  function init() {
    document.querySelectorAll(".mindmap-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("data-map");
        document.querySelectorAll(".mindmap-tab").forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");
        document.querySelectorAll(".mindmap-panel").forEach((p) =>
          p.classList.toggle("active", p.id === "mindmap-" + id)
        );
      });
    });

    [
      ["bridge", "mapBridge"],
      ["unconscious", "mapUnconscious"],
      ["practice", "mapPractice"]
    ].forEach(([dom, key]) => {
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
  }

  window.ConsciousnessMindmaps = { init, onLangChange };
})();

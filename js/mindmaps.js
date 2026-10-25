/* Dense layered SVG mindmaps — bumptalk-style bands, bilingual labels, detail panel */
(function () {
  const Data = () => window.ConsciousnessMindmapData;
  const CAT = () => (Data() && Data().cats) || {};

  function lang() {
    return document.documentElement.getAttribute("data-lang") || "zh";
  }
  function isZh() {
    return lang() !== "en";
  }
  function ui() {
    const t = window.t ? window.t(lang()) : null;
    return (t && t.mindmaps) || {};
  }
  function L(node, field) {
    if (!node) return "";
    if (field === "label") return isZh() ? node.zh : node.en;
    if (field === "sub") return isZh() ? node.subZh || "" : node.subEn || "";
    if (field === "detail") return isZh() ? node.detailZh || "" : node.detailEn || "";
    return "";
  }
  function mapMeta(map) {
    if (!map) return {};
    return {
      title: isZh() ? map.titleZh : map.titleEn,
      desc: isZh() ? map.descZh : map.descEn,
      how: isZh() ? map.howZh : map.howEn
    };
  }

  function styleFor(cat) {
    return CAT()[cat] || CAT().default || { fill: "#e2e8f0", stroke: "#64748b", text: "#0f172a", shape: "pill" };
  }

  function appendShape(g, shape, tw, th, cls) {
    const ns = "http://www.w3.org/2000/svg";
    let el;
    if (shape === "hex") {
      const w = tw / 2;
      const h = th / 2;
      const pts = [
        [0, -h],
        [w * 0.88, -h * 0.5],
        [w * 0.88, h * 0.5],
        [0, h],
        [-w * 0.88, h * 0.5],
        [-w * 0.88, -h * 0.5]
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
      el.setAttribute("rx", shape === "gear" ? 5 : 9);
    } else {
      el = document.createElementNS(ns, "rect");
      el.setAttribute("x", -tw / 2);
      el.setAttribute("y", -th / 2);
      el.setAttribute("width", tw);
      el.setAttribute("height", th);
      el.setAttribute("rx", Math.min(14, th / 2));
    }
    el.setAttribute("class", cls);
    g.appendChild(el);
    return el;
  }

  /** Layered band layout — dense like cs.bumptalk.org */
  function layoutBands(map, W) {
    const nodes = (map.nodes || []).map((n) => ({ ...n }));
    const byId = {};
    nodes.forEach((n) => (byId[n.id] = n));

    const bandIds = [...new Set(nodes.map((n) => n.band || 0))].sort((a, b) => a - b);
    const marginX = 18;
    const topY = 56;
    const bandGap = 118;
    const nodeH = 52;

    bandIds.forEach((b, bi) => {
      const row = nodes.filter((n) => (n.band || 0) === b);
      const n = row.length || 1;
      const usable = W - marginX * 2;
      const gap = 10;
      const maxW = b === 0 ? Math.min(420, usable * 0.55) : Math.min(200, (usable - gap * (n - 1)) / n);
      const widths = row.map((node) => {
        if (node.core || b === 0) return Math.min(440, Math.max(280, maxW));
        const label = (node.zh || "") + (node.en || "");
        const approx = Math.min(210, Math.max(132, 28 + label.length * 3.2));
        return approx;
      });
      const totalW = widths.reduce((a, c) => a + c, 0) + gap * (n - 1);
      let x = marginX + Math.max(0, (usable - totalW) / 2);
      const y = topY + bi * bandGap;
      row.forEach((node, i) => {
        node._w = widths[i];
        node._h = node.core || b === 0 ? 56 : nodeH;
        node._x = x + node._w / 2;
        node._y = y + node._h / 2;
        node._bandIndex = bi;
        x += widths[i] + gap;
      });
    });

    const links = (map.links || [])
      .map(([from, to]) => ({ from, to }))
      .filter((L) => byId[L.from] && byId[L.to]);

    const H = topY + bandIds.length * bandGap + 36;
    return { nodes, links, byId, H, bandIds };
  }

  function createMap(container, mapKey) {
    const pack = Data();
    if (!pack || !pack.maps[mapKey]) return null;
    let map = pack.maps[mapKey];

    const W = 1100;
    const state = { scale: 1, tx: 0, ty: 0, dragging: false, px: 0, py: 0, selected: null };

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

    const stage = document.createElement("div");
    stage.className = "mm-stage";
    container.appendChild(stage);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("mindmap-svg");
    svg.setAttribute("role", "img");
    stage.appendChild(svg);

    const detail = document.createElement("aside");
    detail.className = "mm-detail";
    detail.setAttribute("aria-live", "polite");
    detail.innerHTML =
      `<div class="mm-detail-empty"></div>` +
      `<div class="mm-detail-body" hidden>` +
      `<div class="mm-detail-kicker"></div>` +
      `<h4 class="mm-detail-title"></h4>` +
      `<p class="mm-detail-bilingual"></p>` +
      `<p class="mm-detail-text"></p>` +
      `<p class="mm-detail-sub"></p>` +
      `<button type="button" class="btn btn-ghost mm-detail-close"></button>` +
      `</div>`;
    container.appendChild(detail);

    const caption = document.createElement("p");
    caption.className = "mm-caption";
    container.appendChild(caption);

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <filter id="mm-glow-${mapKey}" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="2.4" flood-color="#000" flood-opacity="0.4"/>
      </filter>
      <linearGradient id="mm-bg-${mapKey}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0b1220"/>
        <stop offset="45%" stop-color="#121a2f"/>
        <stop offset="100%" stop-color="#0f2a2a"/>
      </linearGradient>
      <marker id="mm-arrow-${mapKey}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#5eead4" fill-opacity="0.7"/>
      </marker>`;
    svg.appendChild(defs);

    const gRoot = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gRoot.classList.add("mm-world");
    svg.appendChild(gRoot);
    const gBands = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const gLinks = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const gNodes = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gRoot.appendChild(gBands);
    gRoot.appendChild(gLinks);
    gRoot.appendChild(gNodes);

    function applyTransform() {
      gRoot.setAttribute("transform", `translate(${state.tx} ${state.ty}) scale(${state.scale})`);
    }

    function renderLegend() {
      legend.innerHTML = (map.legend || [])
        .map((it) => {
          const st = styleFor(it.cat);
          const label = isZh() ? it.zh : it.en;
          return `<span class="mm-leg-item" style="--mm-fill:${st.fill};--mm-stroke:${st.stroke};--mm-text:${st.text}">
            <span class="mm-leg-swatch" data-shape="${st.shape}"></span>
            <span class="mm-leg-icon">${it.icon || ""}</span>
            <span>${label}</span>
          </span>`;
        })
        .join("");
    }

    function setDetail(node) {
      const empty = detail.querySelector(".mm-detail-empty");
      const body = detail.querySelector(".mm-detail-body");
      const U = ui();
      if (!node) {
        state.selected = null;
        empty.hidden = false;
        body.hidden = true;
        empty.textContent = U.detailHint || (isZh() ? "點節點睇詳情 · Click a node" : "Click a node for detail");
        detail.classList.remove("has-selection");
        gNodes.querySelectorAll(".mm-node").forEach((el) => el.classList.remove("is-selected"));
        return;
      }
      state.selected = node.id;
      empty.hidden = true;
      body.hidden = false;
      detail.classList.add("has-selection");
      const st = styleFor(node.cat);
      detail.querySelector(".mm-detail-kicker").textContent =
        (node.icon ? node.icon + " " : "") + (isZh() ? node.cat : node.cat);
      detail.querySelector(".mm-detail-kicker").style.color = st.stroke;
      detail.querySelector(".mm-detail-title").textContent =
        (node.icon ? node.icon + " " : "") + L(node, "label");
      detail.querySelector(".mm-detail-bilingual").textContent = isZh()
        ? node.en
        : node.zh;
      detail.querySelector(".mm-detail-text").textContent = L(node, "detail");
      const sub = L(node, "sub");
      const subEl = detail.querySelector(".mm-detail-sub");
      subEl.textContent = sub;
      subEl.hidden = !sub;
      detail.querySelector(".mm-detail-close").textContent = U.closeDetail || (isZh() ? "關閉" : "Close");
      gNodes.querySelectorAll(".mm-node").forEach((el) => {
        el.classList.toggle("is-selected", el.getAttribute("data-id") === node.id);
      });
    }

    function draw() {
      const layout = layoutBands(map, W);
      const H = Math.max(520, layout.H);
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("aria-label", mapMeta(map).title);

      // background
      gBands.innerHTML = "";
      gLinks.innerHTML = "";
      gNodes.innerHTML = "";

      const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bg.setAttribute("width", W);
      bg.setAttribute("height", H);
      bg.setAttribute("fill", `url(#mm-bg-${mapKey})`);
      gBands.appendChild(bg);

      // soft blobs
      [
        [160, 120, "#a78bfa", 0.16],
        [920, 160, "#22d3ee", 0.14],
        [560, H - 80, "#fb7185", 0.12],
        [200, H - 100, "#4ade80", 0.1]
      ].forEach(([cx, cy, color, op]) => {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", cx);
        c.setAttribute("cy", cy);
        c.setAttribute("r", 130);
        c.setAttribute("fill", color);
        c.setAttribute("opacity", op);
        gBands.appendChild(c);
      });

      // band labels
      (map.bands || []).forEach((band, i) => {
        const rowNodes = layout.nodes.filter((n) => n._bandIndex === i + 1);
        if (!rowNodes.length && i + 1 !== 0) {
          // bands array aligns to band index 1..n (band 0 is root)
        }
        const sample = layout.nodes.find((n) => (n.band || 0) === i + 1);
        if (!sample) return;
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("class", "mm-band-text");
        label.setAttribute("x", 16);
        label.setAttribute("y", sample._y - sample._h / 2 - 12);
        label.setAttribute("fill", "#5eead4");
        label.setAttribute("font-size", "11");
        label.setAttribute("font-weight", "700");
        label.setAttribute("opacity", "0.9");
        label.textContent = isZh() ? band.zh : band.en;
        gBands.appendChild(label);
      });

      // links
      layout.links.forEach((Lnk) => {
        const a = layout.byId[Lnk.from];
        const b = layout.byId[Lnk.to];
        if (!a || !b || a._x == null || b._x == null) return;
        const st = styleFor(b.cat);
        const sameBand = (a.band || 0) === (b.band || 0);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let d;
        if (sameBand) {
          const midY = Math.min(a._y, b._y) - 28;
          d = `M ${a._x} ${a._y} C ${a._x} ${midY}, ${b._x} ${midY}, ${b._x} ${b._y}`;
        } else {
          const x1 = a._x;
          const y1 = a._y + a._h / 2 - 2;
          const x2 = b._x;
          const y2 = b._y - b._h / 2 + 2;
          const cy = (y1 + y2) / 2;
          d = `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;
        }
        path.setAttribute("d", d);
        path.setAttribute("class", "mm-link");
        path.setAttribute("stroke", st.stroke);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-width", sameBand ? "1.4" : "2");
        path.setAttribute("stroke-opacity", sameBand ? "0.45" : "0.75");
        if (sameBand) path.setAttribute("stroke-dasharray", "4 3");
        gLinks.appendChild(path);
      });

      // nodes
      layout.nodes.forEach((n) => {
        const st = styleFor(n.cat);
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "mm-node" + (n.core ? " is-core" : "") + (state.selected === n.id ? " is-selected" : ""));
        g.setAttribute("data-id", n.id);
        g.setAttribute("transform", `translate(${n._x} ${n._y})`);
        g.style.cursor = "pointer";

        const tw = n._w;
        const th = n._h;
        const shapeEl = appendShape(g, n.core ? "hex" : st.shape, tw, th, "mm-pill");
        shapeEl.setAttribute("fill", st.fill);
        shapeEl.setAttribute("stroke", state.selected === n.id ? "#fff" : st.stroke);
        shapeEl.setAttribute("stroke-width", n.core || state.selected === n.id ? 3.2 : 2);
        shapeEl.setAttribute("filter", `url(#mm-glow-${mapKey})`);

        // bilingual: primary + secondary line
        const primary = (n.icon ? n.icon + " " : "") + (isZh() ? n.zh : n.en);
        const secondary = isZh() ? n.en : n.zh;
        const t1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t1.setAttribute("text-anchor", "middle");
        t1.setAttribute("class", "mm-label");
        t1.setAttribute("fill", st.text);
        t1.setAttribute("font-weight", "700");
        t1.setAttribute("font-size", n.core ? "14" : "11.5");
        t1.setAttribute("y", secondary ? -6 : 1);
        t1.textContent = primary.length > 28 ? primary.slice(0, 26) + "…" : primary;
        g.appendChild(t1);

        if (secondary) {
          const t2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
          t2.setAttribute("text-anchor", "middle");
          t2.setAttribute("class", "mm-label-sub");
          t2.setAttribute("fill", st.text);
          t2.setAttribute("opacity", "0.72");
          t2.setAttribute("font-size", "9.5");
          t2.setAttribute("font-weight", "600");
          t2.setAttribute("y", 10);
          t2.textContent = secondary.length > 32 ? secondary.slice(0, 30) + "…" : secondary;
          g.appendChild(t2);
        }

        g.addEventListener("click", (e) => {
          e.stopPropagation();
          setDetail(n);
        });
        g.addEventListener("pointerenter", () => {
          shapeEl.setAttribute("stroke-width", "3.4");
        });
        g.addEventListener("pointerleave", () => {
          if (state.selected !== n.id) {
            shapeEl.setAttribute("stroke-width", n.core ? "3.2" : "2");
          }
        });
        gNodes.appendChild(g);
      });

      applyTransform();
      const meta = mapMeta(map);
      caption.innerHTML = `<strong>${isZh() ? "怎麼讀這張圖：" : "How to read:"}</strong> ${meta.how || ""}`;
      toolbar.querySelector(".mm-reset").textContent = ui().reset || (isZh() ? "重設" : "Reset");
      if (state.selected) {
        const still = layout.byId[state.selected];
        setDetail(still || null);
      } else {
        setDetail(null);
      }
    }

    detail.querySelector(".mm-detail-close").addEventListener("click", () => setDetail(null));
    svg.addEventListener("click", () => setDetail(null));

    toolbar.querySelector(".mm-zoom-in").addEventListener("click", () => {
      state.scale = Math.min(2.2, state.scale * 1.15);
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
      state.selected = null;
      draw();
    });

    svg.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".mm-node")) return;
      state.dragging = true;
      state.px = e.clientX;
      state.py = e.clientY;
      svg.setPointerCapture(e.pointerId);
      svg.classList.add("is-dragging");
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
      svg.classList.remove("is-dragging");
      try {
        svg.releasePointerCapture(e.pointerId);
      } catch (_) {}
    });
    svg.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.92 : 1.08;
        state.scale = Math.max(0.45, Math.min(2.2, state.scale * factor));
        applyTransform();
      },
      { passive: false }
    );

    renderLegend();
    draw();

    return {
      refresh() {
        const pack2 = Data();
        if (!pack2 || !pack2.maps[mapKey]) return;
        map = pack2.maps[mapKey];
        renderLegend();
        draw();
      },
      show() {
        // reflow when tab becomes visible
        draw();
      }
    };
  }

  const instances = {};

  function syncChrome() {
    const pack = Data();
    const U = ui();
    if (!pack) return;
    pack.order.forEach((id) => {
      const map = pack.maps[id];
      if (!map) return;
      const meta = mapMeta(map);
      const title = document.querySelector(`[data-mm-title="${id}"]`);
      const desc = document.querySelector(`[data-mm-desc="${id}"]`);
      if (title) title.textContent = meta.title;
      if (desc) desc.textContent = meta.desc;
      const tab = document.querySelector(`.mindmap-tab[data-map="${id}"]`);
      if (tab) {
        const key = "tab" + id.charAt(0).toUpperCase() + id.slice(1);
        tab.textContent = U[key] || (isZh() ? map.titleZh : map.titleEn);
      }
    });
    const lede = document.querySelector('[data-i18n="mindmaps.lede"]');
    if (lede && U.lede) lede.textContent = U.lede;
    const h2 = document.querySelector('[data-i18n="mindmaps.title"]');
    if (h2 && U.title) h2.textContent = U.title;
    const label = document.querySelector('[data-i18n="mindmaps.label"]');
    if (label && U.label) label.textContent = U.label;
  }

  function init() {
    const pack = Data();
    if (!pack) {
      console.warn("ConsciousnessMindmapData missing");
      return;
    }

    document.querySelectorAll(".mindmap-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("data-map");
        document.querySelectorAll(".mindmap-tab").forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");
        document.querySelectorAll(".mindmap-panel").forEach((p) =>
          p.classList.toggle("active", p.id === "mindmap-" + id)
        );
        if (instances[id] && instances[id].show) instances[id].show();
      });
    });

    pack.order.forEach((id) => {
      const el = document.getElementById("mindmap-canvas-" + id);
      if (el) instances[id] = createMap(el, id);
    });

    syncChrome();
  }

  function onLangChange() {
    Object.values(instances).forEach((inst) => inst && inst.refresh && inst.refresh());
    syncChrome();
  }

  window.ConsciousnessMindmaps = { init, onLangChange };
})();

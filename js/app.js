/* Language toggle, nav, dynamic content fill */
(function () {
  const STORAGE_KEY = "consciousness-lang";

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "zh") return saved;
    return "zh";
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    apply(lang);
    if (window.ConsciousnessGames) window.ConsciousnessGames.onLangChange();
    if (window.ConsciousnessBrain) window.ConsciousnessBrain.onLangChange();
    if (window.ConsciousnessMindmaps) window.ConsciousnessMindmaps.onLangChange();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function renderSectionBlocks(sections) {
    if (!sections || !sections.length) return "";
    return sections
      .map((sec) => {
        const ps = (sec.p || [])
          .map((para) => `<p>${escapeHtml(para)}</p>`)
          .join("");
        const bullets =
          sec.bullets && sec.bullets.length
            ? `<ul class="essay-bullets">${sec.bullets
                .map((b) => `<li>${escapeHtml(b)}</li>`)
                .join("")}</ul>`
            : "";
        return `<div class="essay-sec"><h4>${escapeHtml(sec.h || "")}</h4>${ps}${bullets}</div>`;
      })
      .join("");
  }

  function renderEssayArticles(list, openFirst) {
    if (!list || !list.length) return "";
    return list
      .map((essay, idx) => {
        const open = openFirst && idx === 0 ? " open" : "";
        const dates = essay.dates
          ? `<span class="figure-dates">${escapeHtml(essay.dates)}</span>`
          : "";
        const tag = essay.tag
          ? `<span class="essay-tag">${escapeHtml(essay.tag)}</span>`
          : "";
        return `<details class="essay-article"${open}><summary><span class="essay-sum-text"><span class="essay-title">${escapeHtml(
          essay.title || ""
        )}</span>${dates}${tag}</span></summary><div class="essay-body">${renderSectionBlocks(
          essay.sections
        )}</div></details>`;
      })
      .join("");
  }

  function portraitHtml(f) {
    if (f.portrait) {
      return `<img class="portrait" src="${escapeAttr(f.portrait)}" alt="${escapeAttr(
        f.alt || f.name
      )}" width="72" height="72" loading="lazy" />`;
    }
    const mono = f.mono || (f.name || "?").charAt(0);
    return `<span class="portrait mono" aria-hidden="true">${escapeHtml(mono)}</span>`;
  }

  function apply(lang) {
    const d = window.t(lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const path = el.getAttribute("data-i18n");
      const val = path.split(".").reduce((o, k) => (o ? o[k] : undefined), d);
      if (val == null || typeof val === "object") return;
      el.textContent = val;
    });

    const btn = document.getElementById("lang-toggle");
    if (btn) btn.textContent = d.langBtn;

    // TOC
    const toc = document.getElementById("toc-flow");
    if (toc && d.toc) {
      toc.innerHTML = d.toc
        .map(
          (item, i) =>
            `<li><a href="${escapeAttr(item.h)}"><span class="toc-n">${i + 1}</span>${escapeHtml(
              item.t
            )}</a></li>`
        )
        .join("");
    }

    // Define cards
    const defCards = document.getElementById("define-cards");
    if (defCards && d.define.cards) {
      defCards.innerHTML = d.define.cards
        .map(
          (c) =>
            `<article class="card"><span class="tag">${escapeHtml(c.tag)}</span><h3>${escapeHtml(
              c.title
            )}</h3><p>${escapeHtml(c.body)}</p></article>`
        )
        .join("");
    }

    const pills = document.getElementById("camp-pills");
    if (pills && d.define.camps) {
      pills.innerHTML = d.define.camps
        .split("·")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => `<span class="pill">${escapeHtml(s)}</span>`)
        .join("");
    }

    // Science deep theories
    const embodiedCards = document.getElementById("embodied-cards");
    if (embodiedCards && d.embodied && d.embodied.cards) {
      embodiedCards.innerHTML = d.embodied.cards
        .map(
          (c) =>
            `<article class="card embodied-card"><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(
              c.body
            )}</p></article>`
        )
        .join("");
    }

    const sci = document.getElementById("science-theories");
    if (sci && d.science.theories) {
      sci.innerHTML = renderEssayArticles(d.science.theories, true);
    } else if (sci && d.science.cards) {
      sci.innerHTML = d.science.cards
        .map(
          (c) =>
            `<article class="card"><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(
              c.body
            )}</p></article>`
        )
        .join("");
    }

    // West figures with portraits
    const westBox = document.getElementById("west-figures");
    if (westBox && d.west.figures) {
      westBox.innerHTML = d.west.figures
        .map(
          (f) =>
            `<article class="figure-item has-portrait">${portraitHtml(
              f
            )}<div class="figure-text"><span class="name">${escapeHtml(
              f.name
            )}</span>${
              f.dates
                ? `<span class="figure-dates">${escapeHtml(f.dates)}</span>`
                : ""
            }<span class="meta">${escapeHtml(f.meta)}</span><p>${escapeHtml(
              f.body
            )}</p></div></article>`
        )
        .join("");
    }

    const westEssays = document.getElementById("west-essays");
    if (westEssays && d.west.essays) {
      westEssays.innerHTML = renderEssayArticles(d.west.essays, false);
    }

    // East cards
    const east = document.getElementById("east-cards");
    if (east && d.meditation.eastCards) {
      east.innerHTML = d.meditation.eastCards
        .map((c) => {
          const img = c.portrait
            ? `<img class="portrait sm" src="${escapeAttr(c.portrait)}" alt="${escapeAttr(
                c.alt || c.title
              )}" width="56" height="56" loading="lazy" />`
            : `<span class="portrait mono sm" aria-hidden="true">${escapeHtml(
                c.mono || "·"
              )}</span>`;
          return `<article class="card card-with-portrait">${img}<div><h4>${escapeHtml(
            c.title
          )}</h4>${
            c.dates
              ? `<span class="figure-dates">${escapeHtml(c.dates)}</span>`
              : ""
          }<p>${escapeHtml(c.body)}</p></div></article>`;
        })
        .join("");
    }

    const eastEssays = document.getElementById("east-essays");
    if (eastEssays && d.meditation.essays) {
      eastEssays.innerHTML = renderEssayArticles(d.meditation.essays, false);
    }

    // Meditation stages
    const stages = document.getElementById("meditation-stages");
    if (stages && d.meditation.stages) {
      stages.innerHTML = d.meditation.stages
        .map(
          (s) =>
            `<article class="card"><h3>${escapeHtml(s.t)}</h3><p>${escapeHtml(s.b)}</p></article>`
        )
        .join("");
    }

    // Meditation map table
    const mtable = document.getElementById("meditation-map-table");
    if (mtable && d.meditation.mapHeaders) {
      mtable.innerHTML =
        `<thead><tr>${d.meditation.mapHeaders
          .map((h) => `<th>${escapeHtml(h)}</th>`)
          .join("")}</tr></thead><tbody>${d.meditation.mapRows
          .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody>`;
    }

    // Unconscious models
    const um = document.getElementById("unconscious-models");
    if (um && d.unconscious.models) {
      um.innerHTML = d.unconscious.models
        .map((m) => {
          const img = m.portrait
            ? `<img class="portrait" src="${escapeAttr(m.portrait)}" alt="${escapeAttr(
                m.alt || m.title
              )}" width="72" height="72" loading="lazy" />`
            : `<span class="portrait mono" aria-hidden="true">${escapeHtml(m.mono || "?")}</span>`;
          return `<article class="card card-with-portrait">${img}<div><h3>${escapeHtml(
            m.title
          )}</h3>${
            m.dates
              ? `<span class="figure-dates">${escapeHtml(m.dates)}</span>`
              : ""
          }<p>${escapeHtml(m.body)}</p></div></article>`;
        })
        .join("");
    }

    // Iceberg
    const ice = document.getElementById("iceberg");
    if (ice && d.unconscious.iceberg) {
      const legend = d.unconscious.iceberg
        .map((layer) => {
          const tone = layer.tone || "cog";
          return `<span class="ice-leg"><i class="tone-${escapeAttr(
            tone
          )}" style="background:var(--ice-${escapeAttr(tone)}, #94a3b8)"></i>${escapeHtml(
            layer.icon || ""
          )} ${escapeHtml(layer.k)}</span>`;
        })
        .join("");
      ice.innerHTML =
        `<div class="iceberg-legend">${legend}</div>` +
        d.unconscious.iceberg
          .map((layer) => {
            const tone = layer.tone || "cog";
            return `<div class="ice-layer tone-${escapeAttr(tone)}" title="${escapeAttr(
              layer.tip || ""
            )}"><span class="ice-icon" aria-hidden="true">${escapeHtml(
              layer.icon || ""
            )}</span><strong>${escapeHtml(layer.k)}</strong><span>${escapeHtml(
              layer.v
            )}</span>${
              layer.tip
                ? `<span class="ice-tip">${escapeHtml(layer.tip)}</span>`
                : ""
            }</div>`;
          })
          .join("");
    }

    // Unconscious compare table
    const ut = document.getElementById("unconscious-table");
    if (ut && d.unconscious.compareHeaders) {
      ut.innerHTML =
        `<thead><tr>${d.unconscious.compareHeaders
          .map((h) => `<th>${escapeHtml(h)}</th>`)
          .join("")}</tr></thead><tbody>${d.unconscious.compareRows
          .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody>`;
    }

    // Pyramid
    const pyr = document.getElementById("sense-pyramid");
    if (pyr && d.unconscious.pyramid) {
      pyr.innerHTML = d.unconscious.pyramid
        .map(
          (p, i) =>
            `<div class="pyr-step" style="width:${92 - i * 10}%"><strong>${escapeHtml(
              p.t
            )}</strong><span>${escapeHtml(p.d)}</span></div>`
        )
        .join("");
    }

    const uncEssays = document.getElementById("unconscious-essays");
    if (uncEssays && d.unconscious.essays) {
      uncEssays.innerHTML = renderEssayArticles(d.unconscious.essays, false);
    }

    // Research
    const researchBox = document.getElementById("research-items");
    if (researchBox && d.research.items) {
      researchBox.innerHTML = d.research.items
        .map(
          (it) =>
            `<article class="card"><h3>${escapeHtml(it.t)}</h3><p>${escapeHtml(it.b)}</p></article>`
        )
        .join("");
    }

    // Resources
    const resBox = document.getElementById("resource-list");
    if (resBox && d.resources.items) {
      resBox.innerHTML = d.resources.items
        .map(
          (it) =>
            `<li><a href="${escapeAttr(it.u)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
              it.a
            )}</a><span class="note">${escapeHtml(it.n)}</span></li>`
        )
        .join("");
    }

    // Games panel titles
    const map = [
      ["stroop-title", d.games.stroop.title],
      ["stroop-desc", d.games.stroop.desc],
      ["stroop-note", d.games.stroop.note],
      ["cb-title", d.games.change.title],
      ["cb-desc", d.games.change.desc],
      ["cb-note", d.games.change.note],
      ["quiz-title", d.games.quiz.title],
      ["quiz-desc", d.games.quiz.desc]
    ];
    map.forEach(([id, text]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    });
    document.querySelectorAll("[data-i18n-games-start]").forEach((el) => {
      el.textContent = d.games.start;
    });
    const again = document.getElementById("quiz-again");
    if (again) again.textContent = d.games.quiz.again;
  }

  function initNav() {
    const menuBtn = document.getElementById("menu-btn");
    const links = document.getElementById("nav-links");
    if (menuBtn && links) {
      menuBtn.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      links.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          links.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const lang = getLang();
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    apply(lang);
    initNav();
    document.getElementById("lang-toggle").addEventListener("click", () => {
      const next =
        (document.documentElement.getAttribute("data-lang") || "zh") === "zh" ? "en" : "zh";
      setLang(next);
    });
    if (window.ConsciousnessGames) window.ConsciousnessGames.init();
    if (window.ConsciousnessBrain) window.ConsciousnessBrain.init();
    if (window.ConsciousnessMindmaps) window.ConsciousnessMindmaps.init();
  });
})();

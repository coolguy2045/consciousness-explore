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
  }

  function apply(lang) {
    const d = window.t(lang);

    // static data-i18n keys via nested path
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const path = el.getAttribute("data-i18n");
      const val = path.split(".").reduce((o, k) => (o ? o[k] : undefined), d);
      if (val == null) return;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.value = val;
      else el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const path = el.getAttribute("data-i18n-aria");
      const val = path.split(".").reduce((o, k) => (o ? o[k] : undefined), d);
      if (val != null) el.setAttribute("aria-label", val);
    });

    // Lang button
    const btn = document.getElementById("lang-toggle");
    if (btn) btn.textContent = d.langBtn;

    // Western figures
    const westBox = document.getElementById("west-figures");
    if (westBox) {
      westBox.innerHTML = d.west.figures
        .map(
          (f) =>
            `<article class="figure-item"><div><span class="name">${escapeHtml(
              f.name
            )}</span><span class="meta">${escapeHtml(
              f.meta
            )}</span></div><p>${escapeHtml(f.body)}</p></article>`
        )
        .join("");
    }

    // Research items
    const researchBox = document.getElementById("research-items");
    if (researchBox) {
      researchBox.innerHTML = d.research.items
        .map(
          (it) =>
            `<article class="card"><h3>${escapeHtml(it.t)}</h3><p>${escapeHtml(
              it.b
            )}</p></article>`
        )
        .join("");
    }

    // Resources
    const resBox = document.getElementById("resource-list");
    if (resBox) {
      resBox.innerHTML = d.resources.items
        .map(
          (it) =>
            `<li><a href="${escapeAttr(it.u)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
              it.a
            )}</a><span class="note">${escapeHtml(it.n)}</span></li>`
        )
        .join("");
    }

    // Camp pills from camps string ( · separated)
    const pills = document.getElementById("camp-pills");
    if (pills && d.what.camps) {
      pills.innerHTML = d.what.camps
        .split("·")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => `<span class="pill">${escapeHtml(s)}</span>`)
        .join("");
    }

    // Game notes & titles (panels)
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

    // Start buttons that use shared keys
    document.querySelectorAll("[data-i18n-games-start]").forEach((el) => {
      el.textContent = d.games.start;
    });
    document.querySelectorAll("[data-i18n-games-restart]").forEach((el) => {
      el.textContent = d.games.restart;
    });
    const again = document.getElementById("quiz-again");
    if (again) again.textContent = d.games.quiz.again;
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
      const next = (document.documentElement.getAttribute("data-lang") || "zh") === "zh" ? "en" : "zh";
      setLang(next);
    });
    if (window.ConsciousnessGames) window.ConsciousnessGames.init();
  });
})();

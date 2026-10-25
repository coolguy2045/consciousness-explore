/* Interactive mini-games — Stroop, change blindness, theory quiz */
(function () {
  const COLORS = ["red", "green", "blue", "yellow"];
  const COLOR_HEX = { red: "#f87171", green: "#4ade80", blue: "#60a5fa", yellow: "#facc15" };

  function lang() {
    return document.documentElement.getAttribute("data-lang") || "zh";
  }
  function G() {
    return window.t(lang()).games;
  }
  function C() {
    return window.t(lang()).colors;
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    const tabs = document.querySelectorAll(".game-tab");
    const panels = document.querySelectorAll(".game-panel");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("data-game");
        tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");
        panels.forEach((p) => {
          p.classList.toggle("active", p.id === "game-" + id);
        });
      });
    });
  }

  /* ---------- Stroop ---------- */
  const stroop = {
    trials: [],
    i: 0,
    correct: 0,
    rts: [],
    t0: 0,
    running: false,
    init() {
      document.getElementById("stroop-start").addEventListener("click", () => this.start());
      document.querySelectorAll("#stroop-colors button").forEach((btn) => {
        btn.addEventListener("click", () => this.answer(btn.dataset.color));
      });
      this.renderIdle();
    },
    renderIdle() {
      const g = G();
      document.getElementById("stroop-word").textContent = "—";
      document.getElementById("stroop-word").style.color = "var(--text-muted)";
      document.getElementById("stroop-status").textContent = g.ready;
      document.getElementById("stroop-colors").hidden = true;
    },
    start() {
      this.trials = [];
      for (let n = 0; n < 12; n++) {
        const word = COLORS[Math.floor(Math.random() * 4)];
        let ink = COLORS[Math.floor(Math.random() * 4)];
        // bias toward incongruent
        if (Math.random() < 0.7) {
          while (ink === word) ink = COLORS[Math.floor(Math.random() * 4)];
        }
        this.trials.push({ word, ink });
      }
      this.i = 0;
      this.correct = 0;
      this.rts = [];
      this.running = true;
      document.getElementById("stroop-colors").hidden = false;
      this.showTrial();
    },
    showTrial() {
      if (this.i >= this.trials.length) return this.finish();
      const g = G();
      const c = C();
      const tr = this.trials[this.i];
      const el = document.getElementById("stroop-word");
      el.textContent = c[tr.word];
      el.style.color = COLOR_HEX[tr.ink];
      document.getElementById("stroop-status").textContent =
        g.stroop.prompt + " · " + (this.i + 1) + "/12";
      // update button labels
      document.querySelectorAll("#stroop-colors button").forEach((btn) => {
        btn.textContent = c[btn.dataset.color];
      });
      this.t0 = performance.now();
    },
    answer(color) {
      if (!this.running) return;
      const tr = this.trials[this.i];
      const rt = performance.now() - this.t0;
      this.rts.push(rt);
      const g = G();
      const ok = color === tr.ink;
      if (ok) this.correct++;
      document.getElementById("stroop-status").textContent = ok
        ? g.stroop.feedbackOk
        : g.stroop.feedbackBad;
      this.i++;
      setTimeout(() => this.showTrial(), 380);
    },
    finish() {
      this.running = false;
      const g = G();
      const avg = this.rts.length
        ? Math.round(this.rts.reduce((a, b) => a + b, 0) / this.rts.length)
        : 0;
      const acc = Math.round((this.correct / this.trials.length) * 100);
      document.getElementById("stroop-word").textContent = g.stroop.done;
      document.getElementById("stroop-word").style.color = "var(--accent-3)";
      document.getElementById("stroop-status").textContent =
        g.score + ": " + this.correct + "/12 · " +
        g.accuracy + ": " + acc + "% · " +
        g.avgRt + ": " + avg + " " + g.ms;
      document.getElementById("stroop-colors").hidden = true;
    },
    onLang() {
      if (!this.running) this.renderIdle();
      const c = C();
      document.querySelectorAll("#stroop-colors button").forEach((btn) => {
        btn.textContent = c[btn.dataset.color];
      });
    }
  };

  /* ---------- Change blindness ---------- */
  const changeGame = {
    raf: null,
    phase: "idle",
    changeRect: null,
    found: false,
    init() {
      this.canvas = document.getElementById("cb-canvas");
      this.ctx = this.canvas.getContext("2d");
      this.overlay = document.getElementById("cb-overlay");
      document.getElementById("cb-start").addEventListener("click", () => this.start());
      this.canvas.addEventListener("click", (e) => this.onClick(e));
      this.resize();
      window.addEventListener("resize", () => this.resize());
      this.drawScene(false);
    },
    resize() {
      const box = this.canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.floor(box.width * dpr);
      this.canvas.height = Math.floor(box.height * dpr);
      this.w = this.canvas.width;
      this.h = this.canvas.height;
      if (this.phase === "idle") this.drawScene(false);
    },
    sceneObjects(changed) {
      const w = this.w, h = this.h;
      const objs = [
        { x: w * 0.12, y: h * 0.55, rw: w * 0.18, rh: h * 0.28, color: "#1e3a5f", label: "b1" },
        { x: w * 0.38, y: h * 0.48, rw: w * 0.14, rh: h * 0.35, color: "#2d4a6f", label: "b2" },
        { x: w * 0.62, y: h * 0.52, rw: w * 0.2, rh: h * 0.3, color: "#243d5c", label: "b3" },
        { x: w * 0.18, y: h * 0.22, rw: w * 0.08, rh: h * 0.08, color: "#fbbf24", label: "star", r: true },
        { x: w * 0.72, y: h * 0.18, rw: w * 0.1, rh: h * 0.06, color: "#94a3b8", label: "cloud" },
        { x: w * 0.48, y: h * 0.28, rw: w * 0.07, rh: h * 0.07, color: changed ? "#f472b6" : "#34d399", label: "orb" }
      ];
      return objs;
    },
    drawScene(changed) {
      const ctx = this.ctx, w = this.w, h = this.h;
      // sky
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#0b1a33");
      g.addColorStop(1, "#132841");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // ground
      ctx.fillStyle = "#0f2a1f";
      ctx.fillRect(0, h * 0.72, w, h * 0.28);
      // moon
      ctx.beginPath();
      ctx.arc(w * 0.85, h * 0.15, w * 0.045, 0, Math.PI * 2);
      ctx.fillStyle = "#e2e8f0";
      ctx.fill();
      const objs = this.sceneObjects(changed);
      objs.forEach((o) => {
        if (o.r) {
          ctx.beginPath();
          ctx.arc(o.x + o.rw / 2, o.y + o.rh / 2, o.rw / 2, 0, Math.PI * 2);
          ctx.fillStyle = o.color;
          ctx.fill();
        } else if (o.label === "cloud") {
          ctx.fillStyle = o.color;
          ctx.beginPath();
          ctx.ellipse(o.x + o.rw / 2, o.y + o.rh / 2, o.rw / 2, o.rh / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (o.label === "orb") {
          ctx.beginPath();
          ctx.arc(o.x + o.rw / 2, o.y + o.rh / 2, o.rw / 2, 0, Math.PI * 2);
          ctx.fillStyle = o.color;
          ctx.shadowColor = o.color;
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.shadowBlur = 0;
          this.changeRect = {
            x: o.x, y: o.y, w: o.rw, h: o.rh
          };
        } else {
          ctx.fillStyle = o.color;
          ctx.fillRect(o.x, o.y, o.rw, o.rh);
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          ctx.fillRect(o.x + o.rw * 0.15, o.y + o.rh * 0.1, o.rw * 0.2, o.rh * 0.35);
        }
      });
    },
    start() {
      cancelAnimationFrame(this.raf);
      this.found = false;
      this.phase = "run";
      const g = G();
      document.getElementById("cb-status").textContent = g.change.find;
      this.overlay.classList.remove("show");
      let showA = true;
      let last = performance.now();
      let blankUntil = 0;
      const loop = (now) => {
        if (this.phase !== "run") return;
        if (now >= blankUntil) {
          if (now - last > 320) {
            // flash blank
            this.ctx.fillStyle = "#1a1a24";
            this.ctx.fillRect(0, 0, this.w, this.h);
            blankUntil = now + 90;
            last = now;
            showA = !showA;
          } else if (now > blankUntil) {
            this.drawScene(!showA);
          }
        }
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    },
    onClick(e) {
      if (this.phase !== "run" || this.found || !this.changeRect) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * this.w;
      const y = ((e.clientY - rect.top) / rect.height) * this.h;
      const r = this.changeRect;
      const pad = Math.max(r.w, r.h) * 0.35;
      const g = G();
      if (x >= r.x - pad && x <= r.x + r.w + pad && y >= r.y - pad && y <= r.y + r.h + pad) {
        this.found = true;
        this.phase = "done";
        cancelAnimationFrame(this.raf);
        this.drawScene(true);
        document.getElementById("cb-status").textContent = g.change.found;
        // highlight
        this.ctx.strokeStyle = "#f0abfc";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(r.x + r.w / 2, r.y + r.h / 2, r.w * 0.9, 0, Math.PI * 2);
        this.ctx.stroke();
      } else {
        document.getElementById("cb-status").textContent = g.change.miss;
      }
    },
    onLang() {
      const g = G();
      if (this.phase === "idle") {
        document.getElementById("cb-status").textContent = g.ready;
      } else if (this.phase === "run") {
        document.getElementById("cb-status").textContent = g.change.find;
      } else if (this.found) {
        document.getElementById("cb-status").textContent = g.change.found;
      }
    }
  };

  /* ---------- Quiz ---------- */
  const quiz = {
    i: 0,
    scores: {},
    init() {
      document.getElementById("quiz-start").addEventListener("click", () => this.start());
      document.getElementById("quiz-again").addEventListener("click", () => this.start());
    },
    keys() {
      return ["dualism", "physicalism", "panpsychism", "idealism", "illusionism", "nondual"];
    },
    start() {
      this.i = 0;
      this.scores = {};
      this.keys().forEach((k) => (this.scores[k] = 0));
      document.getElementById("quiz-result").classList.remove("show");
      document.getElementById("quiz-play").hidden = false;
      document.getElementById("quiz-start").hidden = true;
      this.render();
    },
    render() {
      const qs = window.t(lang()).quizQuestions;
      const g = G().quiz;
      if (this.i >= qs.length) return this.finish();
      const q = qs[this.i];
      document.getElementById("quiz-progress").textContent = g.progress
        .replace("{n}", String(this.i + 1))
        .replace("{total}", String(qs.length));
      document.getElementById("quiz-q").textContent = q.q;
      const box = document.getElementById("quiz-options");
      box.innerHTML = "";
      q.opts.forEach((opt) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = opt.t;
        b.addEventListener("click", () => {
          this.scores[opt.k] = (this.scores[opt.k] || 0) + 1;
          this.i++;
          this.render();
        });
        box.appendChild(b);
      });
    },
    finish() {
      const g = G().quiz;
      document.getElementById("quiz-play").hidden = true;
      document.getElementById("quiz-start").hidden = false;
      const res = document.getElementById("quiz-result");
      res.classList.add("show");
      const ranked = this.keys()
        .map((k) => ({ k, v: this.scores[k] || 0 }))
        .sort((a, b) => b.v - a.v);
      const top = ranked[0];
      document.getElementById("quiz-result-title").textContent =
        g.resultTitle + " — " + g.labels[top.k];
      document.getElementById("quiz-result-body").textContent = g.resultNote;
      const chips = document.getElementById("quiz-chips");
      chips.innerHTML = "";
      ranked.forEach((r, idx) => {
        const span = document.createElement("span");
        span.className = "score-chip" + (idx === 0 ? " top" : "");
        span.textContent = g.labels[r.k] + ": " + r.v;
        chips.appendChild(span);
      });
    },
    onLang() {
      // if mid-quiz, re-render current question in new language
      const play = document.getElementById("quiz-play");
      if (play && !play.hidden) this.render();
      else if (document.getElementById("quiz-result").classList.contains("show")) {
        // refresh labels on chips
        const g = G().quiz;
        const ranked = this.keys()
          .map((k) => ({ k, v: this.scores[k] || 0 }))
          .sort((a, b) => b.v - a.v);
        if (ranked[0]) {
          document.getElementById("quiz-result-title").textContent =
            g.resultTitle + " — " + g.labels[ranked[0].k];
          document.getElementById("quiz-result-body").textContent = g.resultNote;
          const chips = document.getElementById("quiz-chips");
          chips.innerHTML = "";
          ranked.forEach((r, idx) => {
            const span = document.createElement("span");
            span.className = "score-chip" + (idx === 0 ? " top" : "");
            span.textContent = g.labels[r.k] + ": " + r.v;
            chips.appendChild(span);
          });
        }
      }
    }
  };

  window.ConsciousnessGames = {
    init() {
      initTabs();
      stroop.init();
      changeGame.init();
      quiz.init();
    },
    onLangChange() {
      stroop.onLang();
      changeGame.onLang();
      quiz.onLang();
      // refresh static game strings that applyUI may handle separately
    }
  };
})();

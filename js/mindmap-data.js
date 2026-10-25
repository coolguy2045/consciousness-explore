/* Consciousness Explore — rich bilingual mindmap data (cs.bumptalk.org-inspired density) */
window.ConsciousnessMindmapData = {
  "version": 2,
  "cats": {
    "root": {
      "fill": "#fef08a",
      "stroke": "#f59e0b",
      "text": "#1c1917",
      "shape": "hex"
    },
    "phil": {
      "fill": "#c4b5fd",
      "stroke": "#8b5cf6",
      "text": "#1e1b4b",
      "shape": "round"
    },
    "east": {
      "fill": "#f9a8d4",
      "stroke": "#db2777",
      "text": "#831843",
      "shape": "diamond"
    },
    "sci": {
      "fill": "#67e8f9",
      "stroke": "#0891b2",
      "text": "#083344",
      "shape": "rect"
    },
    "brain": {
      "fill": "#fda4af",
      "stroke": "#e11d48",
      "text": "#4c0519",
      "shape": "ellipse"
    },
    "body": {
      "fill": "#86efac",
      "stroke": "#15803d",
      "text": "#14532d",
      "shape": "pill"
    },
    "link": {
      "fill": "#bbf7d0",
      "stroke": "#16a34a",
      "text": "#14532d",
      "shape": "pill"
    },
    "freud": {
      "fill": "#fdba74",
      "stroke": "#ea580c",
      "text": "#7c2d12",
      "shape": "shield"
    },
    "jung": {
      "fill": "#d8b4fe",
      "stroke": "#9333ea",
      "text": "#3b0764",
      "shape": "hex"
    },
    "cog": {
      "fill": "#93c5fd",
      "stroke": "#2563eb",
      "text": "#1e3a8a",
      "shape": "gear"
    },
    "phen": {
      "fill": "#fbcfe8",
      "stroke": "#be185d",
      "text": "#831843",
      "shape": "diamond"
    },
    "samatha": {
      "fill": "#fde68a",
      "stroke": "#d97706",
      "text": "#78350f",
      "shape": "round"
    },
    "vipassana": {
      "fill": "#a5f3fc",
      "stroke": "#0e7490",
      "text": "#164e63",
      "shape": "ellipse"
    },
    "trad": {
      "fill": "#e9d5ff",
      "stroke": "#7c3aed",
      "text": "#4c1d95",
      "shape": "hex"
    },
    "neuro": {
      "fill": "#6ee7b7",
      "stroke": "#059669",
      "text": "#064e3b",
      "shape": "rect"
    },
    "meta": {
      "fill": "#fecdd3",
      "stroke": "#e11d48",
      "text": "#881337",
      "shape": "round"
    },
    "default": {
      "fill": "#e2e8f0",
      "stroke": "#64748b",
      "text": "#0f172a",
      "shape": "pill"
    }
  },
  "order": [
    "science",
    "philosophy",
    "unconscious",
    "embodied",
    "practice"
  ],
  "maps": {
    "science": {
      "id": "science",
      "titleZh": "意識科學地圖",
      "titleEn": "Consciousness Science Map",
      "descZh": "難問題、NCC、GNWT／IIT／HOT／預測加工等理論，連到腦區與對抗式實驗——點節點看詳情。",
      "descEn": "Hard problem, NCCs, GNWT/IIT/HOT/PP and brain links — click nodes for detail.",
      "howZh": "怎麼讀：上排係核心問題 → 中間理論家族 → 腦機制熱點 → 底層橋接概念（Qualia、綁定、Φ、AI）。色塊＝範疇；虛線＝跨層對話。",
      "howEn": "Read top→bottom: core questions → theory families → brain hubs → bridge concepts. Colors = categories; dashed = cross-talk.",
      "legend": [
        {
          "cat": "root",
          "zh": "核心",
          "en": "Core",
          "icon": "✦"
        },
        {
          "cat": "sci",
          "zh": "科學理論",
          "en": "Theories",
          "icon": "🔬"
        },
        {
          "cat": "brain",
          "zh": "腦區",
          "en": "Brain",
          "icon": "🧠"
        },
        {
          "cat": "link",
          "zh": "橋接",
          "en": "Bridges",
          "icon": "🔗"
        },
        {
          "cat": "meta",
          "zh": "元問題",
          "en": "Meta",
          "icon": "❓"
        }
      ],
      "bands": [
        {
          "zh": "核心問題 Core Questions",
          "en": "Core Questions"
        },
        {
          "zh": "主要理論 Families of Theory",
          "en": "Families of Theory"
        },
        {
          "zh": "腦機制／熱點 Brain Mechanisms",
          "en": "Brain Mechanisms"
        },
        {
          "zh": "橋接概念 Bridge Concepts",
          "en": "Bridge Concepts"
        }
      ],
      "nodes": [
        {
          "id": "sci-root",
          "zh": "意識科學",
          "en": "Consciousness Science",
          "cat": "root",
          "icon": "🔬",
          "subZh": "",
          "subEn": "",
          "detailZh": "把主觀經驗放進可檢驗模型：難問題、NCC、對立理論與對抗式實驗。",
          "detailEn": "Subjective experience in testable models: hard problem, NCCs, rival theories, adversarial tests.",
          "band": 0,
          "core": true
        },
        {
          "id": "hard",
          "zh": "難問題",
          "en": "Hard Problem",
          "cat": "meta",
          "icon": "❓",
          "subZh": "Chalmers 1995",
          "subEn": "Chalmers 1995",
          "detailZh": "查默斯：為何物理過程會伴隨「感覺起來像什麼」？易問題是功能／報告。",
          "detailEn": "Chalmers: why do physical processes feel like anything? Easy problems are function/report.",
          "band": 1,
          "core": false
        },
        {
          "id": "ncc",
          "zh": "NCC 神經相關物",
          "en": "Neural Correlates (NCC)",
          "cat": "sci",
          "icon": "📊",
          "subZh": "Crick & Koch",
          "subEn": "Crick & Koch",
          "detailZh": "與特定意識內容最緊密共變的最小神經活動集合——相關≠充分解釋。",
          "detailEn": "Minimal neural activity covarying with a conscious content — correlate ≠ full explanation.",
          "band": 1,
          "core": false
        },
        {
          "id": "report",
          "zh": "報告 vs 現象",
          "en": "Report vs Phenomenal",
          "cat": "phen",
          "icon": "🗣️",
          "subZh": "Access / P-consciousness",
          "subEn": "Access / P-consciousness",
          "detailZh": "可口頭／按鍵報告的通道意識，未必等於現象經驗的全部豐富度（Block）。",
          "detailEn": "Access/report may not exhaust phenomenal richness (Block).",
          "band": 1,
          "core": false
        },
        {
          "id": "adversarial",
          "zh": "對抗式合作",
          "en": "Adversarial Collab.",
          "cat": "link",
          "icon": "⚔️",
          "subZh": "Nature 2025",
          "subEn": "Nature 2025",
          "detailZh": "COGITATE 等：對手一起設計預註冊實驗，同時檢驗 GNWT 與 IIT。",
          "detailEn": "COGITATE etc.: rivals co-design preregistered tests of GNWT & IIT.",
          "band": 1,
          "core": false
        },
        {
          "id": "gnwt",
          "zh": "全域工作空間 GNWT",
          "en": "Global Workspace (GNWT)",
          "cat": "sci",
          "icon": "📡",
          "subZh": "Baars · Dehaene · Mashour",
          "subEn": "Baars · Dehaene · Mashour",
          "detailZh": "意識＝資訊被「廣播」到多個專門模組；點燃（ignition）常連 PFC／頂葉。",
          "detailEn": "Consciousness as broadcast to specialist modules; ignition often tied to PFC/parietal.",
          "band": 2,
          "core": false
        },
        {
          "id": "iit",
          "zh": "整合資訊 IIT",
          "en": "Integrated Info (IIT)",
          "cat": "sci",
          "icon": "Φ",
          "subZh": "Tononi · Koch",
          "subEn": "Tononi · Koch",
          "detailZh": "意識＝系統的整合因果結構；Φ 量化不可還原的資訊整合；偏向後部熱區。",
          "detailEn": "Consciousness as integrated causal structure; Φ measures irreducible integration; posterior hot zone.",
          "band": 2,
          "core": false
        },
        {
          "id": "hot",
          "zh": "高階思想 HOT",
          "en": "Higher-Order Thought",
          "cat": "sci",
          "icon": "🪞",
          "subZh": "Rosenthal · Lau · Brown",
          "subEn": "Rosenthal · Lau · Brown",
          "detailZh": "意識需要對一階表徵的高階表徵／後設認知；常強調前額機制。",
          "detailEn": "Awareness requires higher-order representation of first-order states; often prefrontal.",
          "band": 2,
          "core": false
        },
        {
          "id": "pp",
          "zh": "預測加工 PP",
          "en": "Predictive Processing",
          "cat": "sci",
          "icon": "🎯",
          "subZh": "Friston · Clark · Hohwy",
          "subEn": "Friston · Clark · Hohwy",
          "detailZh": "腦不斷預測感覺輸入；意識與預測誤差、精確度加權、受控幻覺有關。",
          "detailEn": "Brain predicts sensory input; awareness tied to prediction error, precision, controlled hallucination.",
          "band": 2,
          "core": false
        },
        {
          "id": "rpt",
          "zh": "循環處理 RPT",
          "en": "Recurrent Processing",
          "cat": "sci",
          "icon": "🔁",
          "subZh": "Lamme",
          "subEn": "Lamme",
          "detailZh": "局部回饋環路即可有現象意識；不必然需要全域廣播或報告。",
          "detailEn": "Local recurrent loops can suffice for phenomenology; broadcast/report not required.",
          "band": 2,
          "core": false
        },
        {
          "id": "ast",
          "zh": "注意圖式 AST",
          "en": "Attention Schema",
          "cat": "sci",
          "icon": "🗺️",
          "subZh": "Graziano",
          "subEn": "Graziano",
          "detailZh": "腦為自己建「注意的簡化模型」，誤以為有非物理的意識——社會認知式解釋。",
          "detailEn": "Brain builds a simplified model of attention, mistaking it for nonphysical awareness.",
          "band": 2,
          "core": false
        },
        {
          "id": "pfc",
          "zh": "前額／頂葉點燃",
          "en": "PFC / Parietal Ignition",
          "cat": "brain",
          "icon": "🧠",
          "subZh": "",
          "subEn": "",
          "detailZh": "GNWT 常預測：意識內容進入工作空間時前額—頂葉網絡突然放大。",
          "detailEn": "GNWT often predicts sudden fronto-parietal amplification when content enters the workspace.",
          "band": 3,
          "core": false
        },
        {
          "id": "hotzone",
          "zh": "後部熱區",
          "en": "Posterior Hot Zone",
          "cat": "brain",
          "icon": "🔥",
          "subZh": "",
          "subEn": "",
          "detailZh": "IIT／部分 NCC 研究指向枕—頂—顳後區與內容意識更緊密。",
          "detailEn": "IIT and some NCC work link content awareness more tightly to occipito-parieto-temporal cortex.",
          "band": 3,
          "core": false
        },
        {
          "id": "thalamus",
          "zh": "丘腦門控",
          "en": "Thalamic Gating",
          "cat": "brain",
          "icon": "🚪",
          "subZh": "",
          "subEn": "",
          "detailZh": "丘腦—皮質環路調節覺醒與資訊能否進入皮質加工。",
          "detailEn": "Thalamo-cortical loops gate arousal and what reaches cortical processing.",
          "band": 3,
          "core": false
        },
        {
          "id": "dmn",
          "zh": "預設模式網絡",
          "en": "Default Mode (DMN)",
          "cat": "brain",
          "icon": "🪞",
          "subZh": "",
          "subEn": "",
          "detailZh": "自我敘事、心智漫遊、自傳記憶；禪修中常觀察其活動下降。",
          "detailEn": "Self-narrative, mind-wandering, autobiographical memory; often down in meditation.",
          "band": 3,
          "core": false
        },
        {
          "id": "insula",
          "zh": "島葉／ACC",
          "en": "Insula / ACC",
          "cat": "brain",
          "icon": "🫀",
          "subZh": "",
          "subEn": "",
          "detailZh": "內感覺、情緒顯著性、身體自我感——連到具身與預測自我模型。",
          "detailEn": "Interoception, salience, bodily self — bridge to embodiment and predictive self-models.",
          "band": 3,
          "core": false
        },
        {
          "id": "claustrum",
          "zh": "屏狀核（假說）",
          "en": "Claustrum (hyp.)",
          "cat": "brain",
          "icon": "📎",
          "subZh": "",
          "subEn": "",
          "detailZh": "極薄結構、廣連結；曾被猜為「整合意識」樞紐，證據仍爭議。",
          "detailEn": "Thin, highly connected; once hypothesized as an integration hub — still debated.",
          "band": 3,
          "core": false
        },
        {
          "id": "qualia",
          "zh": "Qualia 質感",
          "en": "Qualia",
          "cat": "link",
          "icon": "🌈",
          "subZh": "",
          "subEn": "",
          "detailZh": "經驗的「感覺質」：紅之為紅。物理主義能否還原，是難問題核心。",
          "detailEn": "Felt quality of experience (redness of red). Whether physics can reduce it is the hard problem's core.",
          "band": 4,
          "core": false
        },
        {
          "id": "binding",
          "zh": "綁定問題",
          "en": "Binding Problem",
          "cat": "link",
          "icon": "🧩",
          "subZh": "",
          "subEn": "",
          "detailZh": "顏色、形狀、運動如何合成一個統一物件經驗？",
          "detailEn": "How are color, shape, motion unified into one object experience?",
          "band": 4,
          "core": false
        },
        {
          "id": "ignition",
          "zh": "點燃／閾值",
          "en": "Ignition / Threshold",
          "cat": "link",
          "icon": "💥",
          "subZh": "",
          "subEn": "",
          "detailZh": "弱刺激可無意識加工；超過閾值才「點燃」成可報告意識（GNWT）。",
          "detailEn": "Subliminal processing below threshold; ignition yields reportable awareness (GNWT).",
          "band": 4,
          "core": false
        },
        {
          "id": "phi",
          "zh": "Φ 值",
          "en": "Phi (Φ)",
          "cat": "link",
          "icon": "Φ",
          "subZh": "",
          "subEn": "",
          "detailZh": "IIT 的整合資訊度量；計算極難，小系統可算，大腦仍近似。",
          "detailEn": "IIT's integration measure; intractable at brain scale — approximations used.",
          "band": 4,
          "core": false
        },
        {
          "id": "metacog",
          "zh": "後設認知",
          "en": "Metacognition",
          "cat": "link",
          "icon": "📈",
          "subZh": "",
          "subEn": "",
          "detailZh": "對自己判斷的信心／監察；HOT 與意識測量常用。",
          "detailEn": "Confidence/monitoring of one's own judgments; used in HOT and awareness assays.",
          "band": 4,
          "core": false
        },
        {
          "id": "ai",
          "zh": "AI 意識？",
          "en": "AI Consciousness?",
          "cat": "meta",
          "icon": "🤖",
          "subZh": "",
          "subEn": "",
          "detailZh": "功能相似≠現象經驗。計算功能主義 vs 生物／整合必要條件仍分裂。",
          "detailEn": "Functional similarity ≠ phenomenology. Functionalism vs biological/integration requirements still split.",
          "band": 4,
          "core": false
        }
      ],
      "links": [
        [
          "sci-root",
          "hard"
        ],
        [
          "sci-root",
          "ncc"
        ],
        [
          "sci-root",
          "report"
        ],
        [
          "sci-root",
          "adversarial"
        ],
        [
          "hard",
          "gnwt"
        ],
        [
          "hard",
          "iit"
        ],
        [
          "hard",
          "hot"
        ],
        [
          "hard",
          "pp"
        ],
        [
          "ncc",
          "gnwt"
        ],
        [
          "ncc",
          "iit"
        ],
        [
          "ncc",
          "rpt"
        ],
        [
          "report",
          "hot"
        ],
        [
          "report",
          "gnwt"
        ],
        [
          "adversarial",
          "gnwt"
        ],
        [
          "adversarial",
          "iit"
        ],
        [
          "gnwt",
          "pfc"
        ],
        [
          "gnwt",
          "ignition"
        ],
        [
          "iit",
          "hotzone"
        ],
        [
          "iit",
          "phi"
        ],
        [
          "iit",
          "binding"
        ],
        [
          "hot",
          "metacog"
        ],
        [
          "hot",
          "pfc"
        ],
        [
          "pp",
          "insula"
        ],
        [
          "pp",
          "qualia"
        ],
        [
          "rpt",
          "hotzone"
        ],
        [
          "ast",
          "metacog"
        ],
        [
          "pfc",
          "ignition"
        ],
        [
          "dmn",
          "metacog"
        ],
        [
          "insula",
          "qualia"
        ],
        [
          "qualia",
          "hard"
        ],
        [
          "ai",
          "gnwt"
        ],
        [
          "ai",
          "iit"
        ],
        [
          "ai",
          "hot"
        ]
      ]
    },
    "philosophy": {
      "id": "philosophy",
      "titleZh": "東西方意識哲學",
      "titleEn": "East–West Philosophy of Mind",
      "descZh": "二元、物理主義、泛心、觀念論、現象學，對照唯識、中觀、禪、莊、不二與儒家良知。",
      "descEn": "Dualism, physicalism, panpsychism, idealism, phenomenology ↔ Yogācāra, Madhyamaka, Zen, Zhuangzi, Advaita, Confucian knowing.",
      "howZh": "怎麼讀：上行西方形上學 → 中行東亞／印度進路 → 下行對話橋（意向性、自我／無我、具身、生成）。",
      "howEn": "Western metaphysics → East/South Asian paths → dialogue bridges (intentionality, self/non-self, embodiment).",
      "legend": [
        {
          "cat": "root",
          "zh": "總覽",
          "en": "Overview",
          "icon": "📜"
        },
        {
          "cat": "phil",
          "zh": "西方",
          "en": "Western",
          "icon": "⚖️"
        },
        {
          "cat": "east",
          "zh": "東方",
          "en": "Eastern",
          "icon": "🪷"
        },
        {
          "cat": "link",
          "zh": "橋樑",
          "en": "Bridges",
          "icon": "🔗"
        }
      ],
      "bands": [
        {
          "zh": "西方形上學 Western Metaphysics",
          "en": "Western Metaphysics"
        },
        {
          "zh": "東亞／印度傳統 East & South Asian",
          "en": "East & South Asian Traditions"
        },
        {
          "zh": "對話橋樑 Dialogue Bridges",
          "en": "Dialogue Bridges"
        }
      ],
      "nodes": [
        {
          "id": "phil-root",
          "zh": "意識哲學",
          "en": "Philosophy of Mind",
          "cat": "root",
          "icon": "📜",
          "subZh": "",
          "subEn": "",
          "detailZh": "東西方如何談「心／識／覺」：形上學立場、現象學與佛教心理學交會。",
          "detailEn": "East–West takes on mind/awareness: metaphysics, phenomenology, Buddhist psychology.",
          "band": 0,
          "core": true
        },
        {
          "id": "dual",
          "zh": "實體二元論",
          "en": "Substance Dualism",
          "cat": "phil",
          "icon": "⚖️",
          "subZh": "Descartes",
          "subEn": "Descartes",
          "detailZh": "心與物為兩種實體（笛卡兒）。現代少人持嚴格版，但直覺仍強。",
          "detailEn": "Mind and matter as two substances (Descartes). Strict forms rare; intuitions persist.",
          "band": 1,
          "core": false
        },
        {
          "id": "propdual",
          "zh": "屬性二元／難問題",
          "en": "Property Dualism",
          "cat": "phil",
          "icon": "🌀",
          "subZh": "Chalmers",
          "subEn": "Chalmers",
          "detailZh": "同一物理世界有不可還原的現象屬性（查默斯等）。",
          "detailEn": "Irreducible phenomenal properties in a physical world (Chalmers et al.).",
          "band": 1,
          "core": false
        },
        {
          "id": "phys",
          "zh": "物理主義",
          "en": "Physicalism",
          "cat": "phil",
          "icon": "🧩",
          "subZh": "",
          "subEn": "",
          "detailZh": "一切終究是物理的；意識若真，必可物理說明（還原或非還原變體）。",
          "detailEn": "Everything is ultimately physical; consciousness must be physically accountable.",
          "band": 1,
          "core": false
        },
        {
          "id": "illusion",
          "zh": "幻覺主義",
          "en": "Illusionism",
          "cat": "phil",
          "icon": "🪄",
          "subZh": "Frankish · Dennett",
          "subEn": "Frankish · Dennett",
          "detailZh": "我們錯判自己有不可還原質感；要解釋的是「為何覺得有質感」（Frankish 等）。",
          "detailEn": "We misjudge having irreducible qualia; explain the introspective illusion (Frankish et al.).",
          "band": 1,
          "core": false
        },
        {
          "id": "pan",
          "zh": "泛心論",
          "en": "Panpsychism",
          "cat": "phil",
          "icon": "✨",
          "subZh": "Goff · Chalmers?",
          "subEn": "Goff · Chalmers?",
          "detailZh": "基本物理實體也有極微觀的經驗面向；要解決組合問題。",
          "detailEn": "Fundamental entities have proto-experience; combination problem remains.",
          "band": 1,
          "core": false
        },
        {
          "id": "ideal",
          "zh": "觀念論",
          "en": "Idealism",
          "cat": "phil",
          "icon": "🔮",
          "subZh": "Kastrup · 不二",
          "subEn": "Kastrup · Advaita",
          "detailZh": "心／經驗為根本，物質是其顯現（分析觀念論、某些不二論）。",
          "detailEn": "Mind/experience fundamental; matter as appearance (analytic idealism, some nondualisms).",
          "band": 1,
          "core": false
        },
        {
          "id": "phenom",
          "zh": "現象學",
          "en": "Phenomenology",
          "cat": "phil",
          "icon": "👁️",
          "subZh": "Husserl · Merleau-Ponty",
          "subEn": "Husserl · Merleau-Ponty",
          "detailZh": "回到經驗本身的結構：意向性、時間意識、身體主體（胡塞爾、梅洛龐蒂）。",
          "detailEn": "Structures of lived experience: intentionality, time-consciousness, lived body.",
          "band": 1,
          "core": false
        },
        {
          "id": "yogacara",
          "zh": "唯識／瑜伽行",
          "en": "Yogācāra",
          "cat": "east",
          "icon": "🪷",
          "subZh": "世親 · 玄奘",
          "subEn": "Vasubandhu · Xuanzang",
          "detailZh": "識轉變與八識：阿賴耶識藏習氣；強調「境由識現」。",
          "detailEn": "Eight consciousnesses; ālaya stores seeds; objects as appearances of mind.",
          "band": 2,
          "core": false
        },
        {
          "id": "madhyamaka",
          "zh": "中觀空性",
          "en": "Madhyamaka",
          "cat": "east",
          "icon": "⭕",
          "subZh": "龍樹",
          "subEn": "Nāgārjuna",
          "detailZh": "諸法無自性；意識亦緣起空——破常見與斷見。",
          "detailEn": "Emptiness of inherent nature; awareness too is dependently arisen.",
          "band": 2,
          "core": false
        },
        {
          "id": "chan",
          "zh": "禪／見性",
          "en": "Chan / Zen",
          "cat": "east",
          "icon": "☯️",
          "subZh": "慧能 · 臨濟",
          "subEn": "Huineng · Linji",
          "detailZh": "直指本心、頓悟；公案逼出分別心止息。",
          "detailEn": "Direct pointing to mind; kōans interrupt discursive grasping.",
          "band": 2,
          "core": false
        },
        {
          "id": "zhuang",
          "zh": "莊子心齋",
          "en": "Zhuangzi",
          "cat": "east",
          "icon": "🦋",
          "subZh": "道家",
          "subEn": "Daoist",
          "detailZh": "心齋、坐忘：放下成心，與化為一——對「自我意識」的鬆綁。",
          "detailEn": "Fasting of the mind / sitting forgetting — loosening egoic consciousness.",
          "band": 2,
          "core": false
        },
        {
          "id": "advaita",
          "zh": "不二吠檀多",
          "en": "Advaita Vedānta",
          "cat": "east",
          "icon": "🕉️",
          "subZh": "Śaṅkara",
          "subEn": "Śaṅkara",
          "detailZh": "梵我合一；現象世界為摩耶。純意識（cit）為根本。",
          "detailEn": "Ātman=Brahman; world as māyā; pure awareness (cit) as ground.",
          "band": 2,
          "core": false
        },
        {
          "id": "conf",
          "zh": "儒家慎獨／良知",
          "en": "Confucian Liangzhi",
          "cat": "east",
          "icon": "📿",
          "subZh": "王陽明",
          "subEn": "Wang Yangming",
          "detailZh": "陽明：心即理、致良知——道德覺知與自我修養交織。",
          "detailEn": "Wang Yangming: mind is principle; extend innate moral knowing.",
          "band": 2,
          "core": false
        },
        {
          "id": "intent",
          "zh": "意向性",
          "en": "Intentionality",
          "cat": "link",
          "icon": "➡️",
          "subZh": "",
          "subEn": "",
          "detailZh": "心「關於」對象的指向性——現象學與分析哲學共用概念。",
          "detailEn": "Aboutness of mental states — shared by phenomenology and analytic philosophy.",
          "band": 3,
          "core": false
        },
        {
          "id": "qualia2",
          "zh": "Qualia／感受質",
          "en": "Qualia",
          "cat": "link",
          "icon": "🌈",
          "subZh": "",
          "subEn": "",
          "detailZh": "東亞傳統多用「覺受／受蘊」等語彙討論類似問題，但形上框架不同。",
          "detailEn": "East Asian vocabularies (vedanā etc.) track similar issues in different metaphysics.",
          "band": 3,
          "core": false
        },
        {
          "id": "self",
          "zh": "自我／無我",
          "en": "Self / Non-self",
          "cat": "link",
          "icon": "🪞",
          "subZh": "",
          "subEn": "",
          "detailZh": "西方常問自我是否實體；佛教談五蘊無我——與當代預測自我模型可對話。",
          "detailEn": "Western substance-self vs Buddhist anātman — dialogue with predictive self-models.",
          "band": 3,
          "core": false
        },
        {
          "id": "embod",
          "zh": "具身／境域",
          "en": "Embodiment",
          "cat": "link",
          "icon": "🧍",
          "subZh": "",
          "subEn": "",
          "detailZh": "梅洛龐蒂身體主體 ↔ 緣起／依根塵——心不離身與世界。",
          "detailEn": "Lived body ↔ dependent arising — mind not sealed off from world.",
          "band": 3,
          "core": false
        },
        {
          "id": "enactive",
          "zh": "生成／認知",
          "en": "Enactivism",
          "cat": "link",
          "icon": "🌱",
          "subZh": "Varela · Thompson",
          "subEn": "Varela · Thompson",
          "detailZh": "Varela 等把現象學＋佛教正念帶入認知科學：認知是具身行動中生成。",
          "detailEn": "Varela et al. bring phenomenology + mindfulness into cog-sci: cognition as enacted.",
          "band": 3,
          "core": false
        },
        {
          "id": "neutral",
          "zh": "中立一元",
          "en": "Neutral Monism",
          "cat": "phil",
          "icon": "⚪",
          "subZh": "",
          "subEn": "",
          "detailZh": "底層既非心亦非物（羅素、詹姆士）；心物為其組織方式。",
          "detailEn": "Underlying stuff neither mental nor physical (Russell, James).",
          "band": 3,
          "core": false
        }
      ],
      "links": [
        [
          "phil-root",
          "dual"
        ],
        [
          "phil-root",
          "propdual"
        ],
        [
          "phil-root",
          "phys"
        ],
        [
          "phil-root",
          "illusion"
        ],
        [
          "phil-root",
          "pan"
        ],
        [
          "phil-root",
          "ideal"
        ],
        [
          "phil-root",
          "phenom"
        ],
        [
          "phil-root",
          "yogacara"
        ],
        [
          "phil-root",
          "madhyamaka"
        ],
        [
          "phil-root",
          "chan"
        ],
        [
          "phil-root",
          "zhuang"
        ],
        [
          "phil-root",
          "advaita"
        ],
        [
          "phil-root",
          "conf"
        ],
        [
          "propdual",
          "qualia2"
        ],
        [
          "phys",
          "illusion"
        ],
        [
          "pan",
          "ideal"
        ],
        [
          "phenom",
          "intent"
        ],
        [
          "phenom",
          "embod"
        ],
        [
          "yogacara",
          "self"
        ],
        [
          "madhyamaka",
          "self"
        ],
        [
          "chan",
          "self"
        ],
        [
          "advaita",
          "ideal"
        ],
        [
          "zhuang",
          "embod"
        ],
        [
          "embod",
          "enactive"
        ],
        [
          "phenom",
          "enactive"
        ],
        [
          "intent",
          "enactive"
        ],
        [
          "neutral",
          "pan"
        ],
        [
          "neutral",
          "phys"
        ],
        [
          "conf",
          "self"
        ]
      ]
    },
    "unconscious": {
      "id": "unconscious",
      "titleZh": "無意識／集體語義網",
      "titleEn": "Unconscious & Collective Web",
      "descZh": "Freud 動力、Jung 原型、認知內隱、現象／通道——同詞異義，點開對照。",
      "descEn": "Freudian dynamics, Jungian archetypes, cognitive implicit, P vs A — same word, different referents.",
      "howZh": "怎麼讀：動力／分析 → 認知與現象分離論證 → 文化／身體延伸同「勿混為一談」。",
      "howEn": "Dynamic/analytic → cognitive & P/A debates → cultural/bodily extensions + don't-equate caution.",
      "legend": [
        {
          "cat": "freud",
          "zh": "Freud",
          "en": "Freud",
          "icon": "🛋️"
        },
        {
          "cat": "jung",
          "zh": "Jung",
          "en": "Jung",
          "icon": "🧿"
        },
        {
          "cat": "cog",
          "zh": "認知",
          "en": "Cognitive",
          "icon": "⚙️"
        },
        {
          "cat": "phen",
          "zh": "現象",
          "en": "Phenomenal",
          "icon": "💡"
        },
        {
          "cat": "meta",
          "zh": "警戒",
          "en": "Caution",
          "icon": "⚠️"
        }
      ],
      "bands": [
        {
          "zh": "動力／分析傳統 Dynamic & Analytic",
          "en": "Dynamic & Analytic"
        },
        {
          "zh": "認知與現象 Cognitive & Phenomenal",
          "en": "Cognitive & Phenomenal"
        },
        {
          "zh": "延伸與警戒 Extensions & Cautions",
          "en": "Extensions & Cautions"
        }
      ],
      "nodes": [
        {
          "id": "unc-root",
          "zh": "無意識諸義",
          "en": "Senses of Unconscious",
          "cat": "root",
          "icon": "🌑",
          "subZh": "",
          "subEn": "",
          "detailZh": "同一個詞，Freud 動力、Jung 集體、認知科學內隱、與現象／通道爭論各指不同。",
          "detailEn": "One word, many referents: Freudian drive, Jungian collective, cognitive implicit, P vs A.",
          "band": 0,
          "core": true
        },
        {
          "id": "freud",
          "zh": "Freud 潛意識",
          "en": "Freudian Unconscious",
          "cat": "freud",
          "icon": "🛋️",
          "subZh": "",
          "subEn": "",
          "detailZh": "被壓抑的慾望與衝突；經夢、口誤、症狀「返回」。動力無意識。",
          "detailEn": "Repressed wishes/conflicts returning via dreams, slips, symptoms. Dynamic unconscious.",
          "band": 1,
          "core": false
        },
        {
          "id": "repress",
          "zh": "壓抑／防衛",
          "en": "Repression / Defenses",
          "cat": "freud",
          "icon": "🛡️",
          "subZh": "",
          "subEn": "",
          "detailZh": "自我把不可接受內容擋在意識外；否認、投射、昇華等。",
          "detailEn": "Ego keeps unacceptable content out of awareness: denial, projection, sublimation…",
          "band": 1,
          "core": false
        },
        {
          "id": "dream",
          "zh": "夢工作",
          "en": "Dream-work",
          "cat": "freud",
          "icon": "💭",
          "subZh": "",
          "subEn": "",
          "detailZh": "潛伏夢思經凝縮、移置成為顯夢——可解析的偽裝。",
          "detailEn": "Latent thoughts disguised via condensation/displacement into the manifest dream.",
          "band": 1,
          "core": false
        },
        {
          "id": "idego",
          "zh": "本我—自我—超我",
          "en": "Id–Ego–Superego",
          "cat": "freud",
          "icon": "⚔️",
          "subZh": "",
          "subEn": "",
          "detailZh": "結構模型：本能、現實調解、內化規範之間的張力。",
          "detailEn": "Structural model: drive, reality mediation, internalized norms.",
          "band": 1,
          "core": false
        },
        {
          "id": "jung",
          "zh": "Jung 集體潛意識",
          "en": "Jungian Collective",
          "cat": "jung",
          "icon": "🧿",
          "subZh": "",
          "subEn": "",
          "detailZh": "超個人的心理層：原型形式在神話、夢、藝術中顯現。",
          "detailEn": "Transpersonal layer: archetypal forms in myth, dream, art.",
          "band": 1,
          "core": false
        },
        {
          "id": "arch",
          "zh": "原型",
          "en": "Archetypes",
          "cat": "jung",
          "icon": "🃏",
          "subZh": "",
          "subEn": "",
          "detailZh": "陰影、阿尼瑪／阿尼姆斯、自性、英雄……形式而非固定圖像。",
          "detailEn": "Shadow, anima/animus, Self, Hero… forms, not fixed images.",
          "band": 1,
          "core": false
        },
        {
          "id": "individ",
          "zh": "個體化",
          "en": "Individuation",
          "cat": "jung",
          "icon": "🌀",
          "subZh": "",
          "subEn": "",
          "detailZh": "整合陰影與原型，朝向自性——終身心理發展。",
          "detailEn": "Integrating shadow and archetypes toward the Self — lifelong development.",
          "band": 1,
          "core": false
        },
        {
          "id": "cog",
          "zh": "認知無意識",
          "en": "Cognitive Unconscious",
          "cat": "cog",
          "icon": "⚙️",
          "subZh": "",
          "subEn": "",
          "detailZh": "實驗心理學：內隱記憶、啟動、自動化、偏誤——通常無動力壓抑。",
          "detailEn": "Implicit memory, priming, automaticity, bias — usually without dynamic repression.",
          "band": 2,
          "core": false
        },
        {
          "id": "impl",
          "zh": "內隱記憶",
          "en": "Implicit Memory",
          "cat": "cog",
          "icon": "📦",
          "subZh": "",
          "subEn": "",
          "detailZh": "技能、習慣、啟動效應：表現改變但未必能陳述。",
          "detailEn": "Skills, habits, priming: performance changes without reportable recall.",
          "band": 2,
          "core": false
        },
        {
          "id": "bias",
          "zh": "認知偏誤",
          "en": "Cognitive Biases",
          "cat": "cog",
          "icon": "🤖",
          "subZh": "",
          "subEn": "",
          "detailZh": "系統 1 捷思：可得性、確認偏誤等在意識焦點外運作。",
          "detailEn": "System-1 heuristics: availability, confirmation, etc. outside focal awareness.",
          "band": 2,
          "core": false
        },
        {
          "id": "uws",
          "zh": "無意識感知",
          "en": "Unconscious Perception",
          "cat": "cog",
          "icon": "👁️",
          "subZh": "",
          "subEn": "",
          "detailZh": "掩蔽、連續閃現抑制：刺激影響行為但主體否認看見。",
          "detailEn": "Masking, CFS: stimuli guide behavior while subjects deny seeing.",
          "band": 2,
          "core": false
        },
        {
          "id": "pa",
          "zh": "現象 vs 通道",
          "en": "P vs A Consciousness",
          "cat": "phen",
          "icon": "💡",
          "subZh": "",
          "subEn": "",
          "detailZh": "Block：現象意識（經驗）與通道意識（可報告／推理可用）可分離。",
          "detailEn": "Block: phenomenal experience vs access for report/reasoning can dissociate.",
          "band": 2,
          "core": false
        },
        {
          "id": "overflow",
          "zh": "溢流論證",
          "en": "Overflow Argument",
          "cat": "phen",
          "icon": "✨",
          "subZh": "",
          "subEn": "",
          "detailZh": "現象內容可能比工作記憶能報告的更多——爭議仍大。",
          "detailEn": "Phenomenology may overflow what working memory can report — still contested.",
          "band": 2,
          "core": false
        },
        {
          "id": "gnwu",
          "zh": "工作空間之下",
          "en": "Below the Workspace",
          "cat": "sci",
          "icon": "📡",
          "subZh": "",
          "subEn": "",
          "detailZh": "GNWT：大量專門加工在廣播前／外進行＝認知意義的無意識。",
          "detailEn": "GNWT: much specialist processing pre-/extra-broadcast = cognitive unconscious.",
          "band": 3,
          "core": false
        },
        {
          "id": "culture",
          "zh": "文化無意識",
          "en": "Cultural Unconscious",
          "cat": "jung",
          "icon": "🌍",
          "subZh": "",
          "subEn": "",
          "detailZh": "語言、意識形態、規範內化——接近社會理論的「背景知識」。",
          "detailEn": "Internalized language, ideology, norms — akin to social-theoretic background.",
          "band": 3,
          "core": false
        },
        {
          "id": "bodyu",
          "zh": "身體無意識",
          "en": "Bodily Unconscious",
          "cat": "body",
          "icon": "🫀",
          "subZh": "",
          "subEn": "",
          "detailZh": "姿勢、內臟感覺、情緒基調常在焦點外，卻塑造覺知場。",
          "detailEn": "Posture, visceral tone, affect often extraconscious yet shape the field of awareness.",
          "band": 3,
          "core": false
        },
        {
          "id": "cautionu",
          "zh": "勿混為一談",
          "en": "Don't Equate Them",
          "cat": "meta",
          "icon": "⚠️",
          "subZh": "",
          "subEn": "",
          "detailZh": "Freud ≠ 內隱記憶 ≠ 阿賴耶識。跨傳統類比要標明層次。",
          "detailEn": "Freud ≠ implicit memory ≠ ālaya. Mark levels when analogizing.",
          "band": 3,
          "core": false
        }
      ],
      "links": [
        [
          "unc-root",
          "freud"
        ],
        [
          "unc-root",
          "jung"
        ],
        [
          "unc-root",
          "cog"
        ],
        [
          "unc-root",
          "pa"
        ],
        [
          "freud",
          "repress"
        ],
        [
          "freud",
          "dream"
        ],
        [
          "freud",
          "idego"
        ],
        [
          "jung",
          "arch"
        ],
        [
          "jung",
          "individ"
        ],
        [
          "jung",
          "culture"
        ],
        [
          "cog",
          "impl"
        ],
        [
          "cog",
          "bias"
        ],
        [
          "cog",
          "uws"
        ],
        [
          "cog",
          "gnwu"
        ],
        [
          "pa",
          "overflow"
        ],
        [
          "pa",
          "uws"
        ],
        [
          "pa",
          "gnwu"
        ],
        [
          "bodyu",
          "cog"
        ],
        [
          "bodyu",
          "freud"
        ],
        [
          "cautionu",
          "freud"
        ],
        [
          "cautionu",
          "jung"
        ],
        [
          "cautionu",
          "cog"
        ],
        [
          "arch",
          "dream"
        ],
        [
          "repress",
          "bias"
        ]
      ]
    },
    "embodied": {
      "id": "embodied",
      "titleZh": "腦身具身地圖",
      "titleEn": "Brain–Body Embodiment Map",
      "descZh": "腸神經系統、迷走、內感覺、自主神經、免疫，同 4E 認知與預測身體自我。",
      "descEn": "ENS, vagus, interoception, ANS, immune ↔ 4E cognition and predictive bodily self.",
      "howZh": "怎麼讀：身體系統 → 4E＋預測加工 → 島葉／ACC／腦幹樞紐；記住「第二個大腦」≠第二個思考者。",
      "howEn": "Body systems → 4E + prediction → insula/ACC/brainstem hubs; 'second brain' ≠ second thinker.",
      "legend": [
        {
          "cat": "body",
          "zh": "身體",
          "en": "Body",
          "icon": "🫀"
        },
        {
          "cat": "brain",
          "zh": "腦樞紐",
          "en": "Brain",
          "icon": "🧠"
        },
        {
          "cat": "link",
          "zh": "4E",
          "en": "4E",
          "icon": "🌱"
        },
        {
          "cat": "sci",
          "zh": "預測",
          "en": "Predictive",
          "icon": "🎯"
        },
        {
          "cat": "meta",
          "zh": "警戒",
          "en": "Caution",
          "icon": "⚠️"
        }
      ],
      "bands": [
        {
          "zh": "身體系統 Body Systems",
          "en": "Body Systems"
        },
        {
          "zh": "4E 認知與預測 4E & Prediction",
          "en": "4E Cognition & Prediction"
        },
        {
          "zh": "腦樞紐與警戒 Brain Hubs & Caution",
          "en": "Brain Hubs & Caution"
        }
      ],
      "nodes": [
        {
          "id": "emb-root",
          "zh": "腦—身—世界",
          "en": "Brain–Body–World",
          "cat": "root",
          "icon": "🧍",
          "subZh": "",
          "subEn": "",
          "detailZh": "意識不只在顱內：腸腦軸、迷走神經、內感覺、自主神經與 4E 認知。",
          "detailEn": "Awareness isn't skull-bound: gut–brain, vagus, interoception, ANS, 4E cognition.",
          "band": 0,
          "core": true
        },
        {
          "id": "ens",
          "zh": "腸神經系統 ENS",
          "en": "Enteric Nervous System",
          "cat": "body",
          "icon": "🦠",
          "subZh": "腸腦軸",
          "subEn": "Gut–brain axis",
          "detailZh": "腸壁約數億神經元，可相對獨立調控消化——「第二個大腦」指此，非第二個會諗哲學嘅腦。",
          "detailEn": "Hundreds of millions of neurons in the gut wall — 'second brain' means semi-autonomous control, not a second thinker.",
          "band": 1,
          "core": false
        },
        {
          "id": "vagus",
          "zh": "迷走神經",
          "en": "Vagus Nerve",
          "cat": "body",
          "icon": "🔌",
          "subZh": "多感覺纖維",
          "subEn": "Multisensory fibers",
          "detailZh": "主要副交感幹道；雙向傳遞內臟狀態，影響情緒、發炎與社群參與。",
          "detailEn": "Major parasympathetic highway; bidirectional visceral signals shape affect, inflammation, social engagement.",
          "band": 1,
          "core": false
        },
        {
          "id": "intero",
          "zh": "內感覺",
          "en": "Interoception",
          "cat": "body",
          "icon": "💓",
          "subZh": "島葉核心",
          "subEn": "Insula hub",
          "detailZh": "心跳、呼吸、腸動等體內訊號的感覺與詮釋——自我感的原料。",
          "detailEn": "Sensing/interpreting heartbeat, breath, gut motility — raw material of selfhood.",
          "band": 1,
          "core": false
        },
        {
          "id": "ans",
          "zh": "自主神經",
          "en": "Autonomic NS",
          "cat": "body",
          "icon": "⚡",
          "subZh": "",
          "subEn": "",
          "detailZh": "交感／副交感平衡：戰逃、休息消化；多相位理論談腹側迷走的安全感。",
          "detailEn": "Sympathetic/parasympathetic balance; polyvagal ideas about ventral-vagal safety.",
          "band": 1,
          "core": false
        },
        {
          "id": "immune",
          "zh": "免疫—內分泌",
          "en": "Immune–Endocrine",
          "cat": "body",
          "icon": "🧬",
          "subZh": "",
          "subEn": "",
          "detailZh": "細胞因子、激素改變動機與情緒；生病行為是意識狀態的身體塑造。",
          "detailEn": "Cytokines and hormones reshape motivation/mood; sickness behavior sculpts conscious state.",
          "band": 1,
          "core": false
        },
        {
          "id": "ee1",
          "zh": "具身 Embodied",
          "en": "Embodied",
          "cat": "link",
          "icon": "🤲",
          "subZh": "",
          "subEn": "",
          "detailZh": "認知依賴身體形態與感覺運動回路，不只抽象符號。",
          "detailEn": "Cognition depends on bodily form and sensorimotor loops, not symbols alone.",
          "band": 2,
          "core": false
        },
        {
          "id": "ee2",
          "zh": "嵌入 Embedded",
          "en": "Embedded",
          "cat": "link",
          "icon": "🏠",
          "subZh": "",
          "subEn": "",
          "detailZh": "環境支架（筆記、工具、空間）分擔認知負荷。",
          "detailEn": "Environmental scaffolds (notes, tools, space) offload cognition.",
          "band": 2,
          "core": false
        },
        {
          "id": "ee3",
          "zh": "延伸 Extended",
          "en": "Extended",
          "cat": "link",
          "icon": "📱",
          "subZh": "",
          "subEn": "",
          "detailZh": "Clark & Chalmers：手機／筆記本可成心智過程的一部分（爭議）。",
          "detailEn": "Clark & Chalmers: phones/notebooks can be proper parts of cognitive processes (debated).",
          "band": 2,
          "core": false
        },
        {
          "id": "ee4",
          "zh": "生成 Enactive",
          "en": "Enactive",
          "cat": "link",
          "icon": "🌱",
          "subZh": "",
          "subEn": "",
          "detailZh": "感知是為行動；意義在生物與環境耦合中生成（Varela）。",
          "detailEn": "Perception for action; meaning arises in organism–environment coupling (Varela).",
          "band": 2,
          "core": false
        },
        {
          "id": "ppbody",
          "zh": "預測身體自我",
          "en": "Predictive Bodily Self",
          "cat": "sci",
          "icon": "🎯",
          "subZh": "",
          "subEn": "",
          "detailZh": "腦預測內感覺；情緒是內感覺推理（Seth、Barrett 等進路）。",
          "detailEn": "Brain predicts interoception; emotion as interoceptive inference (Seth, Barrett…).",
          "band": 2,
          "core": false
        },
        {
          "id": "insula2",
          "zh": "島葉地圖",
          "en": "Insular Maps",
          "cat": "brain",
          "icon": "🗺️",
          "subZh": "",
          "subEn": "",
          "detailZh": "後島葉偏身體訊號，前島葉偏主觀感受與顯著性。",
          "detailEn": "Posterior insula: bodily signals; anterior: subjective feeling and salience.",
          "band": 3,
          "core": false
        },
        {
          "id": "acc2",
          "zh": "前扣帶",
          "en": "Anterior Cingulate",
          "cat": "brain",
          "icon": "📍",
          "subZh": "",
          "subEn": "",
          "detailZh": "衝突監測、痛的情感面向、動機——連接到「在不在場」的感覺。",
          "detailEn": "Conflict monitoring, affective pain, motivation — sense of being present.",
          "band": 3,
          "core": false
        },
        {
          "id": "bs2",
          "zh": "腦幹覺醒",
          "en": "Brainstem Arousal",
          "cat": "brain",
          "icon": "⚡",
          "subZh": "",
          "subEn": "",
          "detailZh": "網狀活化系統等維持清醒水平——沒有覺醒就沒有意識內容。",
          "detailEn": "ARAS etc. set wakefulness — no arousal, no conscious contents.",
          "band": 3,
          "core": false
        },
        {
          "id": "heart",
          "zh": "心腦耦合",
          "en": "Heart–Brain Coupling",
          "cat": "body",
          "icon": "💗",
          "subZh": "",
          "subEn": "",
          "detailZh": "心跳週期調節感知閾與威脅偵測；內感覺準度因人而異。",
          "detailEn": "Cardiac cycle modulates perception/threat detection; interoceptive accuracy varies.",
          "band": 3,
          "core": false
        },
        {
          "id": "cautione",
          "zh": "相關≠第二個思考者",
          "en": "Correlate ≠ Second Thinker",
          "cat": "meta",
          "icon": "⚠️",
          "subZh": "",
          "subEn": "",
          "detailZh": "腸腦軸影響情緒與內感覺，但不等於另一個會做哲學推理的大腦。",
          "detailEn": "Gut–brain shapes mood/interoception — it is not another discursive mind.",
          "band": 3,
          "core": false
        }
      ],
      "links": [
        [
          "emb-root",
          "ens"
        ],
        [
          "emb-root",
          "vagus"
        ],
        [
          "emb-root",
          "intero"
        ],
        [
          "emb-root",
          "ans"
        ],
        [
          "emb-root",
          "immune"
        ],
        [
          "ens",
          "vagus"
        ],
        [
          "vagus",
          "intero"
        ],
        [
          "intero",
          "insula2"
        ],
        [
          "intero",
          "ppbody"
        ],
        [
          "ans",
          "vagus"
        ],
        [
          "immune",
          "ans"
        ],
        [
          "emb-root",
          "ee1"
        ],
        [
          "emb-root",
          "ee2"
        ],
        [
          "emb-root",
          "ee3"
        ],
        [
          "emb-root",
          "ee4"
        ],
        [
          "ee1",
          "ppbody"
        ],
        [
          "ee4",
          "ee1"
        ],
        [
          "ee3",
          "ee2"
        ],
        [
          "insula2",
          "acc2"
        ],
        [
          "bs2",
          "ans"
        ],
        [
          "heart",
          "intero"
        ],
        [
          "cautione",
          "ens"
        ],
        [
          "ppbody",
          "insula2"
        ]
      ]
    },
    "practice": {
      "id": "practice",
      "titleZh": "禪修次第 ↔ 腦",
      "titleEn": "Meditation Stages ↔ Brain",
      "descZh": "禪那、觀智、禪宗／大圓滿，對照專注注意、開放監控、DMN——相關≠證果。",
      "descEn": "Jhānas, insight knowledges, Zen/Dzogchen ↔ FA/OM/DMN — correlate ≠ awakening.",
      "howZh": "怎麼讀：止／禪那階梯 → 觀智開展 → 傳統路徑同實驗室範疇／DMN；底警語唔好化約。",
      "howEn": "Śamatha ladder → vipassanā insights → traditional paths vs lab categories/DMN; heed the non-reduction note.",
      "legend": [
        {
          "cat": "samatha",
          "zh": "止",
          "en": "Śamatha",
          "icon": "🕯️"
        },
        {
          "cat": "vipassana",
          "zh": "觀",
          "en": "Insight",
          "icon": "👁️"
        },
        {
          "cat": "trad",
          "zh": "傳統",
          "en": "Traditions",
          "icon": "📿"
        },
        {
          "cat": "neuro",
          "zh": "神經",
          "en": "Neural",
          "icon": "🧬"
        },
        {
          "cat": "meta",
          "zh": "警戒",
          "en": "Caution",
          "icon": "⚠️"
        }
      ],
      "bands": [
        {
          "zh": "止／禪那 Śamatha & Jhānas",
          "en": "Śamatha & Jhānas"
        },
        {
          "zh": "觀智 Vipassanā Insights",
          "en": "Vipassanā Insights"
        },
        {
          "zh": "傳統路徑與腦對照 Paths & Neural Links",
          "en": "Paths & Neural Links"
        }
      ],
      "nodes": [
        {
          "id": "prac-root",
          "zh": "禪修與覺知",
          "en": "Meditation & Awareness",
          "cat": "root",
          "icon": "🪷",
          "subZh": "",
          "subEn": "",
          "detailZh": "止觀階段、漢藏路徑與神經對照——相關≠把修行化約成腦圖。",
          "detailEn": "Samatha/vipassanā stages, East Asian paths, neural correlates — correlate ≠ reduction.",
          "band": 0,
          "core": true
        },
        {
          "id": "sam",
          "zh": "止／奢摩他",
          "en": "Śamatha",
          "cat": "samatha",
          "icon": "🕯️",
          "subZh": "",
          "subEn": "",
          "detailZh": "培養穩定注意力與輕安；九住心等次第描述散亂→安住。",
          "detailEn": "Stable attention and calm; stages from distraction to settledness.",
          "band": 1,
          "core": false
        },
        {
          "id": "j1",
          "zh": "初禪",
          "en": "1st Jhāna",
          "cat": "samatha",
          "icon": "1️⃣",
          "subZh": "",
          "subEn": "",
          "detailZh": "尋、伺、喜、樂、一境性——粗尋伺仍在。",
          "detailEn": "Vitakka, vicāra, pīti, sukha, ekaggatā — directed thought still present.",
          "band": 1,
          "core": false
        },
        {
          "id": "j2",
          "zh": "二禪",
          "en": "2nd Jhāna",
          "cat": "samatha",
          "icon": "2️⃣",
          "subZh": "",
          "subEn": "",
          "detailZh": "尋伺淡出，定生喜樂。",
          "detailEn": "Directed thought fades; joy/pleasure born of concentration.",
          "band": 1,
          "core": false
        },
        {
          "id": "j3",
          "zh": "三禪",
          "en": "3rd Jhāna",
          "cat": "samatha",
          "icon": "3️⃣",
          "subZh": "",
          "subEn": "",
          "detailZh": "喜淡、住妙樂與正念。",
          "detailEn": "Rapture fades; abiding in refined pleasure with mindfulness.",
          "band": 1,
          "core": false
        },
        {
          "id": "j4",
          "zh": "四禪",
          "en": "4th Jhāna",
          "cat": "samatha",
          "icon": "4️⃣",
          "subZh": "",
          "subEn": "",
          "detailZh": "捨與一心；苦樂雙離的平靜基盤。",
          "detailEn": "Equanimity and unity; neither-pain-nor-pleasure base.",
          "band": 1,
          "core": false
        },
        {
          "id": "vip",
          "zh": "觀／毘婆舍那",
          "en": "Vipassanā",
          "cat": "vipassana",
          "icon": "👁️",
          "subZh": "",
          "subEn": "",
          "detailZh": "洞察無常、苦、無我；觀智次第描述經驗如何拆解。",
          "detailEn": "Insight into impermanence, unsatisfactoriness, non-self.",
          "band": 2,
          "core": false
        },
        {
          "id": "anicca",
          "zh": "無常智",
          "en": "Impermanence Insight",
          "cat": "vipassana",
          "icon": "🌊",
          "subZh": "",
          "subEn": "",
          "detailZh": "經驗生滅加速被看見；「心輪」感。",
          "detailEn": "Arising/passing seen faster; mind can feel rapid.",
          "band": 2,
          "core": false
        },
        {
          "id": "dukkha",
          "zh": "苦智",
          "en": "Dukkha Insight",
          "cat": "vipassana",
          "icon": "💔",
          "subZh": "",
          "subEn": "",
          "detailZh": "連微細感受亦見不安穩／不可執。",
          "detailEn": "Even subtle feeling seen as unstable/ungraspable.",
          "band": 2,
          "core": false
        },
        {
          "id": "anatta",
          "zh": "無我智",
          "en": "Anattā Insight",
          "cat": "vipassana",
          "icon": "🌀",
          "subZh": "",
          "subEn": "",
          "detailZh": "五蘊中找不到掌控者；主體感鬆動。",
          "detailEn": "No controller found in the aggregates; sense of self loosens.",
          "band": 2,
          "core": false
        },
        {
          "id": "nirodha",
          "zh": "滅／道智（概）",
          "en": "Path / Fruition (sketch)",
          "cat": "vipassana",
          "icon": "⭕",
          "subZh": "",
          "subEn": "",
          "detailZh": "傳統描述經驗流片刻止息——需善知識引導，勿自行神話化。",
          "detailEn": "Classical momentary cessation — needs qualified guidance; avoid self-mythologizing.",
          "band": 2,
          "core": false
        },
        {
          "id": "zen",
          "zh": "禪宗",
          "en": "Zen / Chan",
          "cat": "trad",
          "icon": "☯️",
          "subZh": "",
          "subEn": "",
          "detailZh": "坐禪、公案、看話；強調頓悟見性與平常心。",
          "detailEn": "Zazen, kōan, huatou; sudden seeing and ordinary mind.",
          "band": 3,
          "core": false
        },
        {
          "id": "dz",
          "zh": "大圓滿／大手印",
          "en": "Dzogchen / Mahāmudrā",
          "cat": "trad",
          "icon": "☀️",
          "subZh": "",
          "subEn": "",
          "detailZh": "本淨覺性直認；止觀不二的「本来」取徑。",
          "detailEn": "Recognizing pristine awareness; nondual path of how-it-is.",
          "band": 3,
          "core": false
        },
        {
          "id": "om",
          "zh": "開放監控",
          "en": "Open Monitoring",
          "cat": "neuro",
          "icon": "🌐",
          "subZh": "",
          "subEn": "",
          "detailZh": "科學分類：不執著跟隨任何生起內容（對應部分觀／默照）。",
          "detailEn": "Lab category: non-reactive monitoring of whatever arises.",
          "band": 3,
          "core": false
        },
        {
          "id": "fa",
          "zh": "專注注意",
          "en": "Focused Attention",
          "cat": "neuro",
          "icon": "🎯",
          "subZh": "",
          "subEn": "",
          "detailZh": "科學分類：錨點（呼吸等）反覆拉回——近止。",
          "detailEn": "Lab category: return to an anchor (breath…) — near śamatha.",
          "band": 3,
          "core": false
        },
        {
          "id": "dmn3",
          "zh": "DMN 下降",
          "en": "DMN ↓",
          "cat": "neuro",
          "icon": "📉",
          "subZh": "",
          "subEn": "",
          "detailZh": "多項研究：熟練禪修者自我敘事網絡活動常降低（相關）。",
          "detailEn": "Often reduced default-mode activity in practiced meditators (correlational).",
          "band": 3,
          "core": false
        },
        {
          "id": "meta2",
          "zh": "元覺知",
          "en": "Meta-awareness",
          "cat": "neuro",
          "icon": "🪞",
          "subZh": "",
          "subEn": "",
          "detailZh": "察覺自己在想／在散——禪修與認知科學的交點。",
          "detailEn": "Noticing that one is thinking/wandering — shared hinge concept.",
          "band": 3,
          "core": false
        },
        {
          "id": "cautionp",
          "zh": "相關≠證果",
          "en": "Correlate ≠ Awakening",
          "cat": "meta",
          "icon": "⚠️",
          "subZh": "",
          "subEn": "",
          "detailZh": "腦圖變化可伴隨練習，但不等於傳統意義的解脫或見地。",
          "detailEn": "Brain changes can track practice without equaling classical awakening.",
          "band": 3,
          "core": false
        }
      ],
      "links": [
        [
          "prac-root",
          "sam"
        ],
        [
          "prac-root",
          "vip"
        ],
        [
          "prac-root",
          "zen"
        ],
        [
          "prac-root",
          "dz"
        ],
        [
          "sam",
          "j1"
        ],
        [
          "j1",
          "j2"
        ],
        [
          "j2",
          "j3"
        ],
        [
          "j3",
          "j4"
        ],
        [
          "sam",
          "fa"
        ],
        [
          "vip",
          "anicca"
        ],
        [
          "anicca",
          "dukkha"
        ],
        [
          "dukkha",
          "anatta"
        ],
        [
          "anatta",
          "nirodha"
        ],
        [
          "vip",
          "om"
        ],
        [
          "zen",
          "om"
        ],
        [
          "dz",
          "meta2"
        ],
        [
          "fa",
          "dmn3"
        ],
        [
          "om",
          "dmn3"
        ],
        [
          "anatta",
          "meta2"
        ],
        [
          "j4",
          "vip"
        ],
        [
          "cautionp",
          "dmn3"
        ],
        [
          "cautionp",
          "nirodha"
        ]
      ]
    }
  }
};

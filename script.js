"use strict";

/* ---------------------------
   Small helpers
---------------------------- */
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];

function formatDateFR(d){
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
}

/* ---------------------------
   Cursor (desktop only)
---------------------------- */
const cursor = $(".cursor");
const cursorDot = $(".cursor-dot");

window.addEventListener("mousemove", (e) => {
  if (!cursor || !cursorDot) return;
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
});

$$("a, button, .project, .timeline__item").forEach(el => {
  el.addEventListener("mouseenter", () => cursor?.classList.add("is-hover"));
  el.addEventListener("mouseleave", () => cursor?.classList.remove("is-hover"));
});

/* ---------------------------
   Hero buttons
---------------------------- */
$("#btnProof")?.addEventListener("click", () => {
  document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
});

/* ---------------------------
   “Last update”
---------------------------- */
$("#lastUpdate").textContent = formatDateFR(new Date());
$("#year").textContent = String(new Date().getFullYear());

/* ---------------------------
   Tilt effect (light, no lib)
---------------------------- */
$$("[data-tilt]").forEach(card => {
  const max = 10;

  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    const rx = (py - 0.5) * -max; // invert
    const ry = (px - 0.5) * max;

    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-1px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
});

/* ---------------------------
   About timeline details
---------------------------- */
const timelineData = {
  but: {
    title: "BUT 3 Science des Données — USPN",
    text: "Formation orientée data : stats, ML, data mining, bases de données, projets concrets. Je cherche toujours à relier la théorie à un cas réel.",
    tags: ["Stats", "ML", "Data Mining", "SQL", "Viz"],
    approach: "Rigueur + pédagogie",
    tools: "Python • R • SQL",
    deliverables: "Notebooks • rapports • dashboards"
  },
  ofeve: {
    title: "Stage — OFEVE (Université Sorbonne Paris Nord)",
    text: "Analyse d’un grand questionnaire USPN (orientation, conditions de vie, etc.). Nettoyage, KPI, segmentation, synthèses, restitution claire pour décision.",
    tags: ["Enquête", "KPI", "Nettoyage", "Clustering", "Restitution"],
    approach: "De la donnée brute → insights",
    tools: "Python • Excel • viz",
    deliverables: "Synthèses • graphiques • conclusions actionnables"
  },
  excel: {
    title: "Automatisation Excel/VBA",
    text: "Macros pour extraire des uniques, compter (NB.SI/SOMMEPROD), calculer %, générer des graphiques et des feuilles de synthèse automatiquement.",
    tags: ["Excel", "VBA", "Automatisation", "Qualité"],
    approach: "Gagner du temps + fiabiliser",
    tools: "Excel • VBA",
    deliverables: "Fichiers synthèse • graphiques • macros réutilisables"
  },
  ml: {
    title: "Projet Data Mining — Insurance cost prediction",
    text: "Dataset ~100k lignes / 54 variables. Modèles de régression, validation, métriques, interprétation (importance des variables) + limites.",
    tags: ["Regression", "Validation", "Features", "Metrics"],
    approach: "Baseline → mieux → explicable",
    tools: "Python (sklearn)",
    deliverables: "Notebook • rapport • résultats"
  }
};

function renderTimelineDetails(key){
  const d = timelineData[key];
  if(!d) return;

  $("#detailsTitle").textContent = d.title;
  $("#detailsText").textContent = d.text;
  $("#detailsApproach").textContent = d.approach;
  $("#detailsTools").textContent = d.tools;
  $("#detailsDeliverables").textContent = d.deliverables;

  const tags = $("#detailsTags");
  tags.innerHTML = "";
  d.tags.forEach(t => {
    const s = document.createElement("span");
    s.className = "pillTag";
    s.textContent = t;
    tags.appendChild(s);
  });
}

$$(".timeline__item").forEach(btn => {
  btn.addEventListener("click", () => {
    renderTimelineDetails(btn.dataset.timeline);
  });
});

/* ---------------------------
   Projects
   ⚠️ IMPORTANT: Replace links with your real repos
---------------------------- */
const projects = [
  {
    id: "ofeve-survey",
    filter: "ofeve",
    tag: "OFEVE",
    title: "USPN Survey — Analyse & synthèses",
    desc: "Questionnaire USPN : nettoyage, KPI, segments, conclusions claires.",
    meta: ["KPI", "Cleaning", "Clustering"],
    problem: "Comment transformer un questionnaire très large en résultats compréhensibles et utilisables ?",
    dataset: [
      "Enquête questionnaire USPN (orientation, vie étudiante, etc.)",
      "Variables multi-choix + réponses texte",
      "Qualité : NA, incohérences, formats"
    ],
    methods: [
      "Nettoyage + recodage",
      "EDA + distributions + corrélations",
      "Segments simples (clustering / regroupements)",
      "Restitution (KPI, charts, synthèses)"
    ],
    results: [
      "KPI lisibles par thème",
      "Insights + points d’attention",
      "Recommandations/actionnables"
    ],
    github: "https://github.com/git-khaled", // <-- replace with repo
    demo: "https://git-khaled.github.io/" // <-- optional
  },
  {
    id: "insurance-ml",
    filter: "ml",
    tag: "Machine Learning",
    title: "Insurance Cost Prediction (100k)",
    desc: "Régression, validation, métriques, interprétation : coûts médicaux.",
    meta: ["Regression", "Validation", "Explainability"],
    problem: "Prédire un coût : choisir un modèle, éviter l’overfit, et expliquer les drivers.",
    dataset: [
      "~100k lignes • 54 variables",
      "Variables numériques & catégorielles",
      "Target : coût"
    ],
    methods: [
      "Baseline (linéaire) → modèles + feature engineering",
      "Train/test + cross-validation",
      "MAE/RMSE/R²",
      "Importance variables (selon modèle)"
    ],
    results: [
      "Amélioration vs baseline",
      "Top variables & interprétation",
      "Limites + axes d’amélioration"
    ],
    github: "https://github.com/git-khaled", // <-- replace
    demo: "https://git-khaled.github.io/" // <-- optional
  },
  {
    id: "excel-vba-synth",
    filter: "excel",
    tag: "Excel/VBA",
    title: "Synthèses automatiques (macros)",
    desc: "Extraction uniques, NB.SI/SOMMEPROD, % dynamiques, graphiques.",
    meta: ["Automation", "Charts", "Robust"],
    problem: "Générer une analyse complète automatiquement (moins d’erreurs, moins de temps).",
    dataset: [
      "Feuilles de données (colonnes par blocs)",
      "Multi-réponses à gérer",
      "N réponses totales variable"
    ],
    methods: [
      "Macros robustes (range dynamique)",
      "Comptages (NB.SI / SOMMEPROD)",
      "Mise en forme + graphiques auto",
      "Lien vers source"
    ],
    results: [
      "Synthèses prêtes à présenter",
      "Temps divisé (run → output)",
      "Standardisation de la méthode"
    ],
    github: "https://github.com/git-khaled", // <-- replace
    demo: "https://git-khaled.github.io/" // <-- optional
  },
  {
    id: "mongodb-r501",
    filter: "db",
    tag: "DB / MongoDB",
    title: "MongoDB — requêtes & analyse (R501)",
    desc: "Requêtes, filtres, tri, agrégations sur collection (ex : pokemons).",
    meta: ["find", "sort", "count", "filters"],
    problem: "Extraire rapidement des informations utiles depuis une base NoSQL.",
    dataset: [
      "Collection MongoDB (ex : pokemons)",
      "Champs type/attaque/défense/etc."
    ],
    methods: [
      "Filtrage ($or, $in, $regex)",
      "Tri (sort) + limit",
      "Comptages (countDocuments)",
      "Structuration des requêtes"
    ],
    results: [
      "Requêtes propres et réutilisables",
      "Réponses rapides à des questions métier"
    ],
    github: "https://github.com/git-khaled", // <-- replace
    demo: "https://git-khaled.github.io/" // <-- optional
  }
];

const projectGrid = $("#projectGrid");

function projectCard(p){
  const div = document.createElement("div");
  div.className = "project";
  div.dataset.filter = p.filter;
  div.dataset.id = p.id;

  div.innerHTML = `
    <span class="project__tag mono">${p.tag} <span style="opacity:.6">•</span> ${p.filter}</span>
    <div class="project__title">${p.title}</div>
    <p class="project__desc">${p.desc}</p>
    <div class="project__meta">
      ${p.meta.map(m => `<span class="metaPill">${m}</span>`).join("")}
    </div>
  `;

  div.addEventListener("click", () => openModal(p.id));
  return div;
}

function renderProjects(list){
  if(!projectGrid) return;
  projectGrid.innerHTML = "";
  list.forEach(p => projectGrid.appendChild(projectCard(p)));
}
renderProjects(projects);

/* ---------------------------
   Filters
---------------------------- */
$$(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".filter").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const f = btn.dataset.filter;
    if(f === "all") renderProjects(projects);
    else renderProjects(projects.filter(p => p.filter === f));
  });
});

/* ---------------------------
   Modal
---------------------------- */
const modal = $("#modal");
function openModal(id){
  const p = projects.find(x => x.id === id);
  if(!p || !modal) return;

  $("#modalTag").textContent = `${p.tag} • ${p.filter}`;
  $("#modalTitle").textContent = p.title;
  $("#modalProblem").textContent = p.problem;

  const ds = $("#modalDataset");
  const ms = $("#modalMethods");
  const rs = $("#modalResults");

  ds.innerHTML = p.dataset.map(x => `<li>${x}</li>`).join("");
  ms.innerHTML = p.methods.map(x => `<li>${x}</li>`).join("");
  rs.innerHTML = p.results.map(x => `<li>${x}</li>`).join("");

  const link = $("#modalLink");
  const demo = $("#modalDemo");
  link.href = p.github || "https://github.com/git-khaled";
  demo.href = p.demo || "https://git-khaled.github.io/";

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  if(!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$$("[data-close]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeModal();
});

/* ---------------------------
   Fake send button
---------------------------- */
$("#fakeSend")?.addEventListener("click", () => {
  const hint = $("#sendHint");
  if(!hint) return;
  hint.textContent = "Demo uniquement 🙂 Utilise plutôt le lien Email/LinkedIn à gauche.";
});

/* ---------------------------
   Playground (canvas)
---------------------------- */
const canvas = $("#plot");
const ctx = canvas?.getContext("2d");
const noiseEl = $("#noise");
const slopeEl = $("#slope");
const noiseVal = $("#noiseVal");
const slopeVal = $("#slopeVal");
const r2El = $("#r2");
const nptsEl = $("#npts");

function randn(){
  // Box-Muller
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function genData(n=120, slope=35, noise=16){
  const xs = [];
  const ys = [];
  for(let i=0;i<n;i++){
    const x = Math.random() * 100;
    const y = 40 + (slope * (x/100)) + randn() * noise;
    xs.push(x);
    ys.push(y);
  }
  return { xs, ys };
}

function linreg(xs, ys){
  const n = xs.length;
  const mean = (arr) => arr.reduce((a,b)=>a+b,0)/arr.length;
  const mx = mean(xs), my = mean(ys);

  let num = 0, den = 0;
  for(let i=0;i<n;i++){
    const dx = xs[i]-mx;
    num += dx*(ys[i]-my);
    den += dx*dx;
  }
  const b1 = den === 0 ? 0 : num/den;
  const b0 = my - b1*mx;

  // R^2
  let ssRes = 0, ssTot = 0;
  for(let i=0;i<n;i++){
    const yhat = b0 + b1*xs[i];
    ssRes += (ys[i]-yhat)**2;
    ssTot += (ys[i]-my)**2;
  }
  const r2 = ssTot === 0 ? 0 : 1 - (ssRes/ssTot);
  return { b0, b1, r2 };
}

function clear(){
  if(!ctx || !canvas) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function drawAxes(){
  if(!ctx || !canvas) return;
  const pad = 56;
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,.16)";
  ctx.lineWidth = 1;

  // box
  ctx.strokeRect(pad, pad, canvas.width - 2*pad, canvas.height - 2*pad);

  // grid
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  for(let i=1;i<=5;i++){
    const x = pad + i*(canvas.width - 2*pad)/6;
    const y = pad + i*(canvas.height - 2*pad)/6;
    ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, canvas.height-pad); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(canvas.width-pad, y); ctx.stroke();
  }

  // labels
  ctx.fillStyle = "rgba(237,237,237,.70)";
  ctx.font = "12px JetBrains Mono";
  ctx.fillText("risk →", canvas.width - pad - 52, canvas.height - pad + 30);
  ctx.save();
  ctx.translate(pad - 34, pad + 50);
  ctx.rotate(-Math.PI/2);
  ctx.fillText("cost →", 0, 0);
  ctx.restore();

  ctx.restore();
}

function mapPoint(x, y){
  const pad = 56;
  const w = canvas.width - 2*pad;
  const h = canvas.height - 2*pad;

  // x in [0,100]
  const px = pad + (x/100) * w;

  // y in roughly [0,120] (auto clamp)
  const yMin = 0;
  const yMax = 140;
  const py = pad + (1 - ( (y - yMin) / (yMax - yMin) )) * h;

  return { px, py };
}

function draw(points, reg){
  if(!ctx || !canvas) return;
  clear();
  drawAxes();

  // points
  ctx.save();
  ctx.fillStyle = "rgba(91,192,235,.55)";
  for(let i=0;i<points.xs.length;i++){
    const { px, py } = mapPoint(points.xs[i], points.ys[i]);
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();

  // regression line
  ctx.save();
  ctx.strokeStyle = "rgba(244,213,141,.85)";
  ctx.lineWidth = 2;

  const x1 = 0, x2 = 100;
  const y1 = reg.b0 + reg.b1*x1;
  const y2 = reg.b0 + reg.b1*x2;

  const p1 = mapPoint(x1, y1);
  const p2 = mapPoint(x2, y2);

  ctx.beginPath();
  ctx.moveTo(p1.px, p1.py);
  ctx.lineTo(p2.px, p2.py);
  ctx.stroke();

  ctx.restore();

  // header
  ctx.save();
  ctx.fillStyle = "rgba(237,237,237,.80)";
  ctx.font = "12px JetBrains Mono";
  ctx.fillText(`y = ${reg.b0.toFixed(2)} + ${reg.b1.toFixed(2)}x`, 56, 30);
  ctx.restore();
}

function updatePlayground(){
  if(!canvas || !ctx) return;

  const noise = Number(noiseEl?.value ?? 16);
  const slope = Number(slopeEl?.value ?? 35);

  noiseVal.textContent = String(noise);
  slopeVal.textContent = String(slope);

  const pts = genData(140, slope/1.2, noise);
  const reg = linreg(pts.xs, pts.ys);

  draw(pts, reg);

  r2El.textContent = reg.r2.toFixed(3);
  nptsEl.textContent = String(pts.xs.length);
}

noiseEl?.addEventListener("input", updatePlayground);
slopeEl?.addEventListener("input", updatePlayground);
updatePlayground();

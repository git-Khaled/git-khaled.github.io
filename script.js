"use strict";

const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];
const clamp = (n,a,b) => Math.max(a, Math.min(b,n));

function formatDateFR(d){
  const pad = (n) => String(n).padStart(2,"0");
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
}

$("#lastUpdate").textContent = formatDateFR(new Date());
$("#year").textContent = String(new Date().getFullYear());

/* ---------------------------
   INTRO (pro, sobre)
---------------------------- */
const intro = $("#intro");
const loadBar = $("#loadBar");
const loadText = $("#loadText");
const enter = $("#enter");
const skip = $("#skipIntro");

const steps = [
  "Chargement des modules : projets",
  "Chargement des modules : démonstrations",
  "Chargement des modules : compétences",
  "Optimisation de l’affichage",
  "Prêt"
];

let p = 0;
let s = 0;

const introTimer = setInterval(() => {
  p = clamp(p + 4 + Math.random()*8, 0, 100);
  loadBar.style.width = `${p}%`;

  if (p > (s+1) * (100/steps.length) && s < steps.length - 1){
    s++;
    loadText.textContent = steps[s];
  }

  if (p >= 100){
    clearInterval(introTimer);
    loadText.textContent = "Prêt";
    enter.disabled = false;
  }
}, 160);

function closeIntro(){
  intro.classList.add("hidden");
  intro.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

enter.addEventListener("click", closeIntro);
skip.addEventListener("click", () => {
  loadBar.style.width = "100%";
  loadText.textContent = "Prêt";
  enter.disabled = false;
  closeIntro();
});

document.body.style.overflow = "hidden";

/* ---------------------------
   PROJETS (cards + modal)
---------------------------- */
const projects = [
  {
    id: "ofeve",
    filter: "ofeve",
    tag: "OFEVE",
    title: "Questionnaire USPN — Analyse & synthèses",
    desc: "Nettoyage, KPI, segments, restitution claire.",
    meta: ["KPI", "Nettoyage", "Restitution"],
    problem: "Transformer un questionnaire très large en résultats compréhensibles et utilisables.",
    dataset: [
      "Enquête USPN (orientation, conditions de vie, etc.)",
      "Variables multi-choix + texte",
      "Qualité : NA, incohérences, formats"
    ],
    methods: [
      "Nettoyage + recodage",
      "EDA : distributions, corrélations",
      "Segments (regroupements / clustering selon besoin)",
      "Synthèses KPI + graphiques"
    ],
    results: [
      "KPI par thème + lecture rapide",
      "Points d’attention + recommandations",
      "Restitution exploitable"
    ],
    github: "https://github.com/git-khaled",
    demo: "https://git-khaled.github.io/"
  },
  {
    id: "ml",
    filter: "ml",
    tag: "Machine Learning",
    title: "Prédiction de coûts (100k) — Régression",
    desc: "Baseline → modèles → validation → interprétation.",
    meta: ["Régression", "Validation", "Interprétation"],
    problem: "Prédire un coût de manière robuste, en évitant l’overfit et en expliquant les facteurs clés.",
    dataset: [
      "~100k lignes • 54 variables",
      "Variables numériques & catégorielles",
      "Target : coût"
    ],
    methods: [
      "Baseline linéaire",
      "Validation : split / CV",
      "Métriques : MAE / RMSE / R²",
      "Importance des variables"
    ],
    results: [
      "Amélioration vs baseline",
      "Lecture des drivers principaux",
      "Limites et axes d’amélioration"
    ],
    github: "https://github.com/git-khaled",
    demo: "https://git-khaled.github.io/"
  },
  {
    id: "excel",
    filter: "excel",
    tag: "Excel / VBA",
    title: "Automatisation : synthèses & graphiques",
    desc: "Extraction uniques, NB.SI/SOMMEPROD, %, graphiques.",
    meta: ["Automatisation", "Fiabilité", "Gain de temps"],
    problem: "Standardiser une analyse et produire automatiquement une synthèse prête à présenter.",
    dataset: [
      "Feuilles par blocs de colonnes",
      "Multi-réponses à gérer",
      "Totaux / N réponses variables"
    ],
    methods: [
      "Macros robustes (ranges dynamiques)",
      "Comptage & %",
      "Mise en forme + charts auto",
      "Liens vers source"
    ],
    results: [
      "Sortie homogène et fiable",
      "Temps réduit",
      "Réutilisable sur d’autres enquêtes"
    ],
    github: "https://github.com/git-khaled",
    demo: "https://git-khaled.github.io/"
  },
  {
    id: "db",
    filter: "db",
    tag: "DB",
    title: "MongoDB — requêtes & filtres",
    desc: "find, sort, limit, countDocuments, $or, $in, etc.",
    meta: ["NoSQL", "Requêtes", "Tri"],
    problem: "Extraire rapidement des réponses précises depuis une base NoSQL.",
    dataset: [
      "Collection MongoDB (ex. pokemons)",
      "Champs : types, stats, etc."
    ],
    methods: [
      "Filtres : $or, $in, $regex",
      "Tri + limit",
      "Comptages",
      "Structuration des requêtes"
    ],
    results: [
      "Requêtes propres et réutilisables",
      "Réponses rapides à des questions"
    ],
    github: "https://github.com/git-khaled",
    demo: "https://git-khaled.github.io/"
  }
];

const cards = $("#cards");

function cardHTML(p){
  return `
    <div class="card" data-id="${p.id}">
      <div class="card__tag mono">${p.tag} • ${p.filter}</div>
      <div class="card__title">${p.title}</div>
      <p class="card__desc">${p.desc}</p>
      <div class="metaRow">
        ${p.meta.map(m => `<span class="meta">${m}</span>`).join("")}
      </div>
    </div>
  `;
}

function render(list){
  cards.innerHTML = list.map(cardHTML).join("");
  $$(".card[data-id]").forEach(el => el.addEventListener("click", () => openModal(el.dataset.id)));
}
render(projects);

$$(".fbtn").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".fbtn").forEach(b => b.classList.remove("is-on"));
    btn.classList.add("is-on");
    const f = btn.dataset.filter;
    render(f === "all" ? projects : projects.filter(p => p.filter === f));
  });
});

/* Modal */
const modal = $("#modal");
function openModal(id){
  const p = projects.find(x => x.id === id);
  if(!p) return;

  $("#mTag").textContent = `${p.tag} • ${p.filter}`;
  $("#mTitle").textContent = p.title;
  $("#mProblem").textContent = p.problem;

  $("#mData").innerHTML = p.dataset.map(x => `<li>${x}</li>`).join("");
  $("#mMethods").innerHTML = p.methods.map(x => `<li>${x}</li>`).join("");
  $("#mResults").innerHTML = p.results.map(x => `<li>${x}</li>`).join("");

  $("#mGithub").href = p.github;
  $("#mDemo").href = p.demo;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
$$("[data-close]").forEach(x => x.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeModal(); });

/* ---------------------------
   DEMO 1 : Régression (canvas)
---------------------------- */
const regCanvas = $("#plotReg");
const regCtx = regCanvas?.getContext("2d");
const noiseEl = $("#noise");
const slopeEl = $("#slope");
const noiseVal = $("#noiseVal");
const slopeVal = $("#slopeVal");
const r2El = $("#r2");
const nptsEl = $("#npts");

function randn(){
  let u=0, v=0;
  while(u===0) u=Math.random();
  while(v===0) v=Math.random();
  return Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v);
}

function genData(n=140, slope=30, noise=16){
  const xs=[], ys=[];
  for(let i=0;i<n;i++){
    const x = Math.random()*100;
    const y = 35 + (slope*(x/100)) + randn()*noise;
    xs.push(x); ys.push(y);
  }
  return {xs, ys};
}

function linreg(xs, ys){
  const n = xs.length;
  const mean = a => a.reduce((s,v)=>s+v,0)/a.length;
  const mx=mean(xs), my=mean(ys);

  let num=0, den=0;
  for(let i=0;i<n;i++){
    const dx = xs[i]-mx;
    num += dx*(ys[i]-my);
    den += dx*dx;
  }
  const b1 = den===0?0:num/den;
  const b0 = my - b1*mx;

  let ssRes=0, ssTot=0;
  for(let i=0;i<n;i++){
    const yhat = b0 + b1*xs[i];
    ssRes += (ys[i]-yhat)**2;
    ssTot += (ys[i]-my)**2;
  }
  const r2 = ssTot===0?0:1-(ssRes/ssTot);
  return {b0,b1,r2};
}

function drawAxes(ctx, w, h){
  const pad=56;
  ctx.save();
  ctx.strokeStyle="rgba(255,255,255,.16)";
  ctx.lineWidth=1;
  ctx.strokeRect(pad,pad,w-2*pad,h-2*pad);

  ctx.strokeStyle="rgba(255,255,255,.08)";
  for(let i=1;i<=5;i++){
    const x=pad+i*(w-2*pad)/6;
    const y=pad+i*(h-2*pad)/6;
    ctx.beginPath();ctx.moveTo(x,pad);ctx.lineTo(x,h-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke();
  }

  ctx.fillStyle="rgba(238,242,247,.70)";
  ctx.font="12px JetBrains Mono";
  ctx.fillText("x →", w-pad-28, h-pad+30);
  ctx.save();
  ctx.translate(pad-30, pad+60);
  ctx.rotate(-Math.PI/2);
  ctx.fillText("y →", 0, 0);
  ctx.restore();
  ctx.restore();
}

function mapPoint(x, y, w, h){
  const pad=56;
  const W=w-2*pad;
  const H=h-2*pad;
  const px = pad + (x/100)*W;
  const yMin=0, yMax=140;
  const py = pad + (1 - ((y-yMin)/(yMax-yMin))) * H;
  return {px, py};
}

function drawReg(points, reg){
  if(!regCtx || !regCanvas) return;
  const ctx=regCtx, w=regCanvas.width, h=regCanvas.height;
  ctx.clearRect(0,0,w,h);
  drawAxes(ctx,w,h);

  ctx.save();
  ctx.fillStyle="rgba(98,208,255,.55)";
  for(let i=0;i<points.xs.length;i++){
    const p = mapPoint(points.xs[i], points.ys[i], w, h);
    ctx.beginPath(); ctx.arc(p.px,p.py,3.2,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle="rgba(244,213,141,.85)";
  ctx.lineWidth=2;
  const x1=0, x2=100;
  const y1=reg.b0+reg.b1*x1;
  const y2=reg.b0+reg.b1*x2;
  const p1=mapPoint(x1,y1,w,h);
  const p2=mapPoint(x2,y2,w,h);
  ctx.beginPath(); ctx.moveTo(p1.px,p1.py); ctx.lineTo(p2.px,p2.py); ctx.stroke();
  ctx.restore();
}

function updateReg(){
  const noise = Number(noiseEl.value);
  const slope = Number(slopeEl.value);
  noiseVal.textContent = String(noise);
  slopeVal.textContent = String(slope);

  const pts = genData(140, slope/1.2, noise);
  const reg = linreg(pts.xs, pts.ys);
  drawReg(pts, reg);

  r2El.textContent = reg.r2.toFixed(3);
  nptsEl.textContent = String(pts.xs.length);
}
noiseEl.addEventListener("input", updateReg);
slopeEl.addEventListener("input", updateReg);
updateReg();

/* ---------------------------
   DEMO 2 : k-means (canvas)
---------------------------- */
const kCanvas = $("#plotK");
const kCtx = kCanvas?.getContext("2d");
const kEl = $("#k");
const kVal = $("#kVal");
const regenBtn = $("#regen");
const iterBtn = $("#iterate");

let kState = { points: [], centroids: [], assign: [] };

const randRange = (a,b)=>a+Math.random()*(b-a);
const dist2 = (a,b)=>{ const dx=a.x-b.x, dy=a.y-b.y; return dx*dx+dy*dy; };

function genPoints(n=240){
  const centers = [{x: 25, y: 30},{x: 72, y: 40},{x: 45, y: 75}];
  const pts=[];
  for(let i=0;i<n;i++){
    const c = centers[i % centers.length];
    pts.push({x: clamp(c.x + randn()*7, 0, 100), y: clamp(c.y + randn()*7, 0, 100)});
  }
  return pts;
}

function initCentroids(k){
  return Array.from({length:k}, ()=>({x: randRange(10,90), y: randRange(10,90)}));
}

function assignPoints(points, centroids){
  return points.map(p => {
    let best=0, bestd=Infinity;
    for(let i=0;i<centroids.length;i++){
      const d = dist2(p, centroids[i]);
      if(d < bestd){ bestd=d; best=i; }
    }
    return best;
  });
}

function recomputeCentroids(points, assign, k){
  const sums = Array.from({length:k}, ()=>({x:0,y:0,n:0}));
  for(let i=0;i<points.length;i++){
    const a = assign[i];
    sums[a].x += points[i].x;
    sums[a].y += points[i].y;
    sums[a].n += 1;
  }
  return sums.map(s => s.n===0 ? {x: randRange(10,90), y: randRange(10,90)} : {x: s.x/s.n, y: s.y/s.n});
}

function mapK(p, w, h){
  const pad=56;
  const W=w-2*pad;
  const H=h-2*pad;
  return { px: pad + (p.x/100)*W, py: pad + (1 - (p.y/100))*H };
}

function drawK(){
  if(!kCtx || !kCanvas) return;
  const ctx=kCtx, w=kCanvas.width, h=kCanvas.height;
  ctx.clearRect(0,0,w,h);
  drawAxes(ctx,w,h);

  const palette = [
    "rgba(98,208,255,.55)",
    "rgba(244,213,141,.55)",
    "rgba(175,125,255,.50)",
    "rgba(120,255,185,.48)",
    "rgba(255,140,120,.50)",
    "rgba(255,220,120,.48)"
  ];

  ctx.save();
  for(let i=0;i<kState.points.length;i++){
    const a = kState.assign[i] ?? 0;
    ctx.fillStyle = palette[a % palette.length];
    const mp = mapK(kState.points[i], w, h);
    ctx.beginPath(); ctx.arc(mp.px, mp.py, 3.1, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle="rgba(255,255,255,.75)";
  ctx.lineWidth=2;
  ctx.font="12px JetBrains Mono";
  ctx.fillStyle="rgba(238,242,247,.85)";
  for(let i=0;i<kState.centroids.length;i++){
    const mp = mapK(kState.centroids[i], w, h);
    ctx.beginPath(); ctx.arc(mp.px, mp.py, 8, 0, Math.PI*2); ctx.stroke();
    ctx.fillText(`c${i+1}`, mp.px+10, mp.py-10);
  }
  ctx.restore();
}

function resetK(){
  const k = Number(kEl.value);
  kVal.textContent = String(k);
  kState.points = genPoints(240);
  kState.centroids = initCentroids(k);
  kState.assign = assignPoints(kState.points, kState.centroids);
  drawK();
}

function iterateK(){
  const k = Number(kEl.value);
  kVal.textContent = String(k);

  if(kState.centroids.length !== k){
    kState.centroids = initCentroids(k);
  }
  kState.assign = assignPoints(kState.points, kState.centroids);
  kState.centroids = recomputeCentroids(kState.points, kState.assign, k);
  drawK();
}

kEl.addEventListener("input", resetK);
regenBtn.addEventListener("click", resetK);
iterBtn.addEventListener("click", iterateK);
resetK();

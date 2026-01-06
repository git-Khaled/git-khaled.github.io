"use strict";

const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];

const state = {
  mode: "recruteur", // ou "technique"
  dataset: {
    axis: "data",
    tone: "clair",
    rows: 100000
  }
};

/* -----------------------
   UTIL
------------------------ */
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
function pad(n){ return String(n).padStart(2,"0"); }
function yearNow(){ return String(new Date().getFullYear()); }

/* -----------------------
   MODE (recruteur / technique)
------------------------ */
function setMode(next){
  state.mode = next;
  $("#modeLabel").textContent = state.mode;
  // narrative recalculée
  computeDataset();
  renderProofs();
}

$("#toggleMode")?.addEventListener("click", () => {
  setMode(state.mode === "recruteur" ? "technique" : "recruteur");
});

/* -----------------------
   (1) INTRO TERMINAL
------------------------ */
const intro = $("#intro");
const terminal = $("#terminal");
const enterBtn = $("#enterSystem");
const skipBtn = $("#skipIntro");

const lines = [
  {t:"Analyse en cours…", d:420},
  {t:"Source : Khaled ELOUASSAR", d:380},
  {t:"Statut : Étudiant BUT 3 Science des Données (USPN)", d:380},
  {t:"Module actif : OFEVE (questionnaire USPN)", d:380},
  {t:"Chargement : compétences, projets, preuves…", d:380},
  {t:"Vérification : rigueur statistique… OK", d:340},
  {t:"Vérification : restitution claire… OK", d:340},
  {t:"Vérification : automatisation (Excel/VBA)… OK", d:340},
  {t:"Anomalie détectée : profil au-dessus de la moyenne", d:520},
  {t:"", d:160},
  {t:"Bienvenue.", d:380},
  {t:"Vous êtes sur le point d’analyser un Data Analyst comme il analyse ses données.", d:520}
];

async function typeLine(text, speed=14){
  for(let i=0;i<text.length;i++){
    terminal.textContent += text[i];
    terminal.scrollTop = terminal.scrollHeight;
    await new Promise(r => setTimeout(r, speed));
  }
  terminal.textContent += "\n";
}

async function runIntro(){
  if(!terminal) return;
  terminal.textContent = "";
  for(const l of lines){
    if(l.t === ""){ await new Promise(r => setTimeout(r, l.d)); continue; }
    await typeLine("> " + l.t, 10);
    await new Promise(r => setTimeout(r, l.d));
  }
  enterBtn.disabled = false;
}

function closeIntro(){
  intro.classList.add("is-hidden");
  intro.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  // petit jump sur dataset pour le “wow”
  setTimeout(() => document.querySelector("#dataset")?.scrollIntoView({behavior:"smooth"}), 180);
}

enterBtn?.addEventListener("click", closeIntro);
skipBtn?.addEventListener("click", () => {
  enterBtn.disabled = false;
  closeIntro();
});

document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && intro && !intro.classList.contains("is-hidden")){
    enterBtn.disabled = false;
    closeIntro();
  }
});

document.body.style.overflow = "hidden";
runIntro();

/* -----------------------
   (2) DATASET MODULE
------------------------ */
$("#year").textContent = yearNow();

const baseDataset = {
  nom: "Khaled ELOUASSAR",
  formation: "BUT 3 Science des Données",
  universite: "Université Sorbonne Paris Nord (USPN)",
  experience_cle: "Stage OFEVE — analyse questionnaire USPN",
  outils: "Python, SQL, R, Excel/VBA",
  style: "Clair, structuré, actionnable",
  specialite: "Transformer des données en décisions"
};

function computeScores({axis, tone, rows}){
  // Scores volontairement "cohérents" et dynamiques
  // (tu peux les ajuster plus tard quand tu veux)
  let clarte = 78;
  let rigueur = 78;
  let auto = 76;

  // influence "axe"
  if(axis === "data"){ clarte += 6; rigueur += 4; auto += 3; }
  if(axis === "ml"){ rigueur += 8; auto += 5; clarte -= 2; }
  if(axis === "automation"){ auto += 10; clarte += 2; rigueur -= 2; }
  if(axis === "db"){ rigueur += 4; auto += 4; clarte += 1; }

  // influence "tone"
  if(tone === "clair"){ clarte += 8; }
  if(tone === "tech"){ rigueur += 8; clarte -= 2; }
  if(tone === "executif"){ clarte += 6; rigueur -= 1; }

  // influence "rows"
  const r = clamp(rows, 1000, 100000);
  const bonus = Math.round((r / 100000) * 10);
  rigueur += bonus;
  auto += Math.round(bonus * 0.8);

  // mode
  if(state.mode === "technique"){
    rigueur += 6;
    clarte -= 2;
  } else {
    clarte += 4;
  }

  return {
    clarte: clamp(clarte, 0, 100),
    rigueur: clamp(rigueur, 0, 100),
    auto: clamp(auto, 0, 100)
  };
}

function narrative({axis, tone, rows}, scores){
  const axisLabel = {
    data: "analyse de données",
    ml: "machine learning",
    automation: "automatisation",
    db: "bases de données"
  }[axis];

  const toneLabel = {
    clair: "claire & actionnable",
    tech: "technique & détaillée",
    executif: "exécutive (KPI)"
  }[tone];

  const rowsTxt = rows >= 100000 ? "jusqu’à 100k lignes" : `~${rows.toLocaleString("fr-FR")} lignes`;

  if(state.mode === "technique"){
    return `Mode technique actif. Axe : ${axisLabel}. Restitution : ${toneLabel}. Données déjà traitées : ${rowsTxt}.
→ Attends-toi à voir des choix de méthodes, de validation, et des limites explicitées (pas juste des graphiques).`;
  }

  return `Mode recruteur actif. Axe : ${axisLabel}. Restitution : ${toneLabel}. Données déjà traitées : ${rowsTxt}.
→ Objectif : transformer un problème réel en KPI + conclusions lisibles en 30 secondes.`;
}

function renderDatasetTable({axis, tone, rows}){
  const tbody = $("#datasetTable");
  const axisLabel = {data:"Analyse de données", ml:"Machine Learning", automation:"Automatisation", db:"Bases de données"}[axis];

  const derived = {
    axe_principal: axisLabel,
    restitution: tone,
    taille_donnees: `${rows.toLocaleString("fr-FR")} lignes`,
    mode: state.mode
  };

  const rowsToRender = {
    ...baseDataset,
    ...derived
  };

  tbody.innerHTML = Object.entries(rowsToRender).map(([k,v]) => `
    <tr>
      <td>${k}</td>
      <td>${String(v)}</td>
    </tr>
  `).join("");
}

function computeDataset(){
  const cfg = state.dataset;
  const scores = computeScores(cfg);

  $("#scoreClarte").textContent = scores.clarte;
  $("#scoreRigueur").textContent = scores.rigueur;
  $("#scoreAuto").textContent = scores.auto;

  $("#datasetNarrative").textContent = narrative(cfg, scores);
  renderDatasetTable(cfg);
}

$("#axis")?.addEventListener("change", (e) => { state.dataset.axis = e.target.value; computeDataset(); });
$("#tone")?.addEventListener("change", (e) => { state.dataset.tone = e.target.value; computeDataset(); });

$("#rows")?.addEventListener("input", (e) => {
  const v = Number(e.target.value);
  state.dataset.rows = v;
  $("#rowsVal").textContent = String(v);
  computeDataset();
});

computeDataset();

/* -----------------------
   PREUVES (cards)
------------------------ */
const proofs = [
  {
    tag: "OFEVE",
    title: "Questionnaire USPN — Analyse & synthèses",
    desc: "Nettoyage, KPI, segments, restitution claire pour la décision.",
    meta: ["KPI", "Nettoyage", "Restitution"],
    link: "https://github.com/git-khaled" // remplace par repo
  },
  {
    tag: "ML",
    title: "Prédiction de coûts (100k) — Régression",
    desc: "Baseline → modèles → validation → interprétation des variables.",
    meta: ["Régression", "Validation", "Interprétation"],
    link: "https://github.com/git-khaled"
  },
  {
    tag: "Excel/VBA",
    title: "Automatisation de synthèses & graphiques",
    desc: "Extraction uniques, NB.SI/SOMMEPROD, %, dashboards automatisés.",
    meta: ["Automatisation", "Fiabilité", "Gain de temps"],
    link: "https://github.com/git-khaled"
  }
];

function renderProofs(){
  const grid = $("#proofGrid");
  if(!grid) return;

  grid.innerHTML = proofs.map(p => `
    <a class="card" href="${p.link}" target="_blank" rel="noreferrer">
      <div class="card__tag mono">${p.tag} • ${state.mode}</div>
      <div class="card__title">${p.title}</div>
      <p class="card__desc">${state.mode === "technique"
        ? (p.desc + " (inclut méthodes/validation/limites).")
        : (p.desc + " (résultat lisible + actionnable).")
      }</p>
      <div class="card__meta">
        ${p.meta.map(m => `<span class="meta">${m}</span>`).join("")}
      </div>
    </a>
  `).join("");
}
renderProofs();

/* -----------------------
   (5) LABO - RÉGRESSION
------------------------ */
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

  ctx.fillStyle="rgba(237,237,237,.70)";
  ctx.font="12px JetBrains Mono";
  ctx.fillText("risque →", w-pad-70, h-pad+30);
  ctx.save();
  ctx.translate(pad-34, pad+60);
  ctx.rotate(-Math.PI/2);
  ctx.fillText("coût →", 0, 0);
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

  // points
  ctx.save();
  ctx.fillStyle="rgba(91,192,235,.55)";
  for(let i=0;i<points.xs.length;i++){
    const p = mapPoint(points.xs[i], points.ys[i], w, h);
    ctx.beginPath(); ctx.arc(p.px,p.py,3.2,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();

  // line
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

  // header
  ctx.save();
  ctx.fillStyle="rgba(237,237,237,.80)";
  ctx.font="12px JetBrains Mono";
  ctx.fillText(`y = ${reg.b0.toFixed(2)} + ${reg.b1.toFixed(2)}x`, 56, 30);
  ctx.restore();
}

function updateReg(){
  if(!regCanvas || !regCtx) return;

  const noise = Number(noiseEl?.value ?? 16);
  const slope = Number(slopeEl?.value ?? 35);
  noiseVal.textContent = String(noise);
  slopeVal.textContent = String(slope);

  const pts = genData(140, slope/1.2, noise);
  const reg = linreg(pts.xs, pts.ys);
  drawReg(pts, reg);

  r2El.textContent = reg.r2.toFixed(3);
  nptsEl.textContent = String(pts.xs.length);
}

noiseEl?.addEventListener("input", updateReg);
slopeEl?.addEventListener("input", updateReg);
updateReg();

/* -----------------------
   (5) LABO - K-MEANS (VISUEL)
------------------------ */
const kCanvas = $("#plotK");
const kCtx = kCanvas?.getContext("2d");
const kEl = $("#k");
const kVal = $("#kVal");
const regenBtn = $("#regen");
const iterBtn = $("#iterate");

let kState = {
  points: [],
  centroids: [],
  assign: []
};

function randRange(a,b){ return a + Math.random()*(b-a); }

function genClusters(n=220){
  // 3 blobs de base (puis k-means pourra regrouper différemment si k change)
  const centers = [
    {x: 25, y: 30},
    {x: 72, y: 40},
    {x: 45, y: 75}
  ];
  const pts = [];
  for(let i=0;i<n;i++){
    const c = centers[i % centers.length];
    const x = c.x + randn()*7;
    const y = c.y + randn()*7;
    pts.push({x: clamp(x,0,100), y: clamp(y,0,100)});
  }
  return pts;
}

function initCentroids(k){
  const cents = [];
  for(let i=0;i<k;i++){
    cents.push({x: randRange(10,90), y: randRange(10,90)});
  }
  return cents;
}

function dist2(a,b){
  const dx=a.x-b.x, dy=a.y-b.y;
  return dx*dx+dy*dy;
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
  return sums.map((s,i) => {
    if(s.n === 0) return {x: randRange(10,90), y: randRange(10,90)};
    return {x: s.x/s.n, y: s.y/s.n};
  });
}

function mapK(p, w, h){
  const pad=56;
  const W=w-2*pad;
  const H=h-2*pad;
  return {
    px: pad + (p.x/100)*W,
    py: pad + (1 - (p.y/100))*H
  };
}

function drawK(){
  if(!kCtx || !kCanvas) return;
  const ctx=kCtx, w=kCanvas.width, h=kCanvas.height;
  ctx.clearRect(0,0,w,h);
  drawAxes(ctx,w,h);

  const palette = [
    "rgba(91,192,235,.55)",
    "rgba(244,213,141,.55)",
    "rgba(175,125,255,.50)",
    "rgba(120,255,185,.48)",
    "rgba(255,140,120,.50)",
    "rgba(255,220,120,.48)"
  ];

  // points
  ctx.save();
  for(let i=0;i<kState.points.length;i++){
    const a = kState.assign[i] ?? 0;
    ctx.fillStyle = palette[a % palette.length];
    const mp = mapK(kState.points[i], w, h);
    ctx.beginPath(); ctx.arc(mp.px, mp.py, 3.1, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();

  // centroids
  ctx.save();
  ctx.strokeStyle="rgba(255,255,255,.75)";
  ctx.lineWidth=2;
  for(let i=0;i<kState.centroids.length;i++){
    const mp = mapK(kState.centroids[i], w, h);
    ctx.fillStyle = "rgba(0,0,0,.0)";
    ctx.beginPath();
    ctx.arc(mp.px, mp.py, 8, 0, Math.PI*2);
    ctx.stroke();

    ctx.fillStyle="rgba(237,237,237,.85)";
    ctx.font="12px JetBrains Mono";
    ctx.fillText(`c${i+1}`, mp.px+10, mp.py-10);
  }
  ctx.restore();
}

function resetK(){
  const k = Number(kEl?.value ?? 3);
  kVal.textContent = String(k);
  kState.points = genClusters(240);
  kState.centroids = initCentroids(k);
  kState.assign = assignPoints(kState.points, kState.centroids);
  drawK();
}

function iterateK(){
  const k = Number(kEl?.value ?? 3);
  kVal.textContent = String(k);

  // si k change, ré-init centroids (sinon ça devient bizarre)
  if(kState.centroids.length !== k){
    kState.centroids = initCentroids(k);
  }

  kState.assign = assignPoints(kState.points, kState.centroids);
  kState.centroids = recomputeCentroids(kState.points, kState.assign, k);
  drawK();
}

kEl?.addEventListener("input", () => {
  // on reset pour que l’expérience soit “propre”
  resetK();
});
regenBtn?.addEventListener("click", resetK);
iterBtn?.addEventListener("click", iterateK);

resetK();

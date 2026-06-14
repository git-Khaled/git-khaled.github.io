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
   INTRO
---------------------------- */
const intro = $("#intro");
const loadBar = $("#loadBar");
const loadText = $("#loadText");
const enter = $("#enter");
const skip = $("#skipIntro");

const steps = [
  "Chargement du parcours",
  "Chargement du bilan d’alternance",
  "Chargement des projets et SAE",
  "Chargement des compétences",
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
   PROJETS ET SAE
---------------------------- */
const projects = [
  {
    id: "cohortes",
    filter: "professionnel",
    tag: "OSPE · Power BI",
    title: "Analyse longitudinale des parcours étudiants",
    desc: "Suivi de cohortes sur cinq années à partir de données Apogée, avec préparation des données et visualisation des trajectoires dans Power BI.",
    meta: ["Power BI", "Apogée", "Sankey", "Data quality"],
    problem: "Construire une lecture compréhensible des parcours étudiants entre 2021 et 2025 malgré des données hétérogènes, des doublons et des rattachements institutionnels complexes.",
    dataset: [
      "Extractions Apogée",
      "Inscriptions administratives à l’étape entre 2021 et 2025",
      "Niveaux, diplômes, disciplines SISE, composantes et territoires"
    ],
    contribution: [
      "Préparation et rapprochement des extractions annuelles",
      "Suppression des doublons et anonymisation",
      "Transformation des codes postaux en départements puis en territoires",
      "Adaptation du visuel Sankey pour représenter cinq années"
    ],
    methods: [
      "Nettoyage et règles de gestion sous Excel / Power Query",
      "Contrôles de cohérence entre années",
      "Modélisation des flux dans Power BI",
      "Construction d’indicateurs de poursuite et de trajectoire"
    ],
    results: [
      "Visualisation synthétique des trajectoires étudiantes",
      "Lecture par formation, niveau, discipline, composante et territoire",
      "Support directement exploitable pour le pilotage universitaire"
    ],
    difficulties: [
      "Saisies Apogée non homogènes selon les composantes",
      "Rattachements et codes qui évoluent selon les années",
      "Limitation initiale du visuel Sankey à deux années"
    ],
    review: [
      "Avant de construire le Sankey, j’ai dû stabiliser les règles utilisées pour relier les données d’une année à l’autre",
      "Cette étape m’a montré qu’une visualisation peut sembler convaincante tout en étant incorrecte si les règles de départ ne sont pas suffisamment vérifiées",
      "C’est la mission dont je suis le plus fier, car j’ai pu suivre tout le travail depuis le nettoyage jusqu’à la visualisation finale"
    ],
    skills: ["C1 Traiter", "C2 Analyser", "C3 Valoriser"],
    github: "https://github.com/git-khaled",
    demo: "https://git-khaled.github.io/"
  },
  {
    id: "medical-costs",
    filter: "sae",
    tag: "SAE · Machine Learning",
    title: "Modélisation prédictive des coûts médicaux",
    desc: "Analyse d’un jeu de données de plus de 100 000 observations afin d’expliquer et de prédire le coût médical annuel.",
    meta: ["100k lignes", "54 variables", "Régression", "Clustering"],
    problem: "Identifier les facteurs associés au coût médical annuel et comparer plusieurs modèles de prédiction sur un jeu de données volumineux et hétérogène.",
    dataset: [
      "Plus de 100 000 observations et 54 variables",
      "Variables médicales, comportementales et démographiques",
      "Variable cible : annual_medical_cost"
    ],
    contribution: [
      "Analyse exploratoire et contrôle des valeurs atypiques",
      "Étude des relations entre variables avec la corrélation de Spearman",
      "Comparaison de plusieurs modèles de régression",
      "Analyse de groupes d’observations atypiques"
    ],
    methods: [
      "Nettoyage, méthode IQR et transformations logarithmiques",
      "Régression linéaire, Ridge, KNN, arbre de décision et random forest",
      "Séparation entraînement / test et comparaison des métriques",
      "Clustering pour mieux comprendre certains profils"
    ],
    results: [
      "Comparaison argumentée des performances des modèles",
      "Identification des variables les plus liées au coût",
      "Mise en évidence des limites des modèles sur les coûts extrêmes"
    ],
    difficulties: [
      "Distribution très asymétrique de la variable cible",
      "Présence d’observations extrêmes influençant les modèles",
      "Nécessité de comparer performance et interprétabilité"
    ],
    review: [
      "Les observations aux coûts très élevés avaient beaucoup d’influence sur les résultats",
      "J’ai compris qu’il ne suffisait pas de comparer les scores moyens : il fallait aussi regarder sur quels profils les modèles se trompaient",
      "Avec plus de temps, j’aurais ajouté une validation croisée plus systématique et une analyse plus détaillée des erreurs"
    ],
    skills: ["C1 Traiter", "C2 Analyser", "C4 Modéliser"],
    github: "https://github.com/git-khaled",
    demo: "https://git-khaled.github.io/#demo"
  },
  {
    id: "sql-nosql",
    filter: "sae",
    tag: "SAE · Bases de données",
    title: "Migration automatisée entre bases SQL et NoSQL",
    desc: "Conception d’une représentation abstraite des données pour automatiser leur passage entre une base relationnelle et une base NoSQL.",
    meta: ["SQLite", "MongoDB", "DAO", "POO"],
    problem: "Rendre la migration SQL vers NoSQL, et inversement, aussi transparente que possible sans dépendre excessivement du format de stockage.",
    dataset: [
      "Données créées pour représenter des sites, donneurs, dons et produits",
      "Schéma relationnel normalisé en troisième forme normale",
      "Plusieurs représentations NoSQL dénormalisées"
    ],
    contribution: [
      "Conception du modèle de données et création des données d’exemple",
      "Mise en place des classes métier et des objets DAO",
      "Définition de plusieurs stratégies de normalisation et de dénormalisation",
      "Automatisation des conversions entre représentations"
    ],
    methods: [
      "Programmation orientée objet",
      "Architecture DAO avec BaseDAO et DAO spécialisés",
      "Normalisation, dénormalisation et renormalisation",
      "Notebook Jupyter documenté"
    ],
    results: [
      "Séparation entre logique métier et persistance",
      "Migration plus simple entre SQLite et MongoDB",
      "Requêtes et transformations reproductibles"
    ],
    difficulties: [
      "Choisir le bon niveau de dénormalisation selon les requêtes visées",
      "Éviter de coupler les objets métier à une seule technologie",
      "Conserver la cohérence lors des migrations"
    ],
    review: [
      "Ce projet m’a montré qu’il n’existe pas une seule bonne manière de structurer les données",
      "Une représentation pratique pour certaines requêtes peut être moins adaptée à d’autres : le choix dépend donc surtout de l’usage prévu",
      "J’ajouterais davantage de tests et une gestion plus claire des erreurs si je devais reprendre ce projet"
    ],
    skills: ["C1 Traiter", "C2 Analyser", "C4 Modéliser"],
    github: "https://github.com/git-khaled",
    demo: "https://git-khaled.github.io/"
  },
  {
    id: "amazon-reviews",
    filter: "sae",
    tag: "SAE · NLP",
    title: "Prédiction de notes Amazon à partir d’avis textuels",
    desc: "Prédiction d’une note de 1 à 5 étoiles en utilisant le texte et le titre de l’avis, la description du produit et son prix.",
    meta: ["NLP", "TF-IDF", "MiniLM", "Régression"],
    problem: "Prédire automatiquement la note attribuée à un produit Amazon à partir de données textuelles, tout en tenant compte de l’ordre naturel entre les notes.",
    dataset: [
      "Texte complet de l’avis et titre de l’avis",
      "Description et prix du produit",
      "Variable cible ordinale : review_score de 1 à 5"
    ],
    contribution: [
      "Formulation du problème comme une régression supervisée",
      "Préparation des différentes sources textuelles",
      "Construction d’une représentation pondérée des champs",
      "Comparaison de représentations textuelles"
    ],
    methods: [
      "TF-IDF sur le texte, le titre et la description",
      "Représentations sémantiques MiniLM",
      "Pondération plus forte du titre de l’avis",
      "Transformation logarithmique du prix et utilisation de la MSE"
    ],
    results: [
      "Mise en place d’un pipeline combinant texte et variable numérique",
      "Choix justifié de la régression pour pénaliser davantage les erreurs éloignées",
      "Résultats chiffrés à compléter avec le rapport final de la SAE"
    ],
    difficulties: [
      "Fusionner des textes de longueurs et d’importances différentes",
      "Choisir entre classification à cinq classes et régression",
      "Évaluer correctement une cible ordinale"
    ],
    review: [
      "La principale réflexion a porté sur le choix entre classification et régression",
      "Nous avons retenu la régression parce qu’une erreur entre une et cinq étoiles devait être davantage pénalisée qu’une erreur entre quatre et cinq étoiles",
      "Je compléterai cette fiche avec les performances finales et une analyse des avis sur lesquels le modèle se trompe le plus"
    ],
    skills: ["C1 Traiter", "C2 Analyser", "C4 Modéliser"],
    github: "https://github.com/git-khaled",
    demo: "https://git-khaled.github.io/"
  },
  {
    id: "excel-automation",
    filter: "professionnel",
    tag: "OSPE · Excel / VBA",
    title: "Automatisation de synthèses d’enquêtes",
    desc: "Développement de macros capables de générer automatiquement des comptages, pourcentages, tableaux et graphiques à partir de données d’enquête.",
    meta: ["VBA", "Enquêtes", "Automatisation", "DataViz"],
    problem: "Réduire le temps de production des synthèses tout en obtenant une sortie homogène et reproductible.",
    dataset: [
      "Exports de questionnaires contenant des réponses simples et multiples",
      "Blocs de colonnes de tailles variables",
      "Données filtrées selon les besoins des analyses"
    ],
    contribution: [
      "Développement et évolution des macros VBA",
      "Gestion des filtres actifs et des plages dynamiques",
      "Création automatique des tableaux et graphiques",
      "Mise en forme des sorties pour la restitution"
    ],
    methods: [
      "Boucles et dictionnaires VBA",
      "Calcul de N, N*, pourcentages et totaux",
      "Création dynamique de graphiques",
      "Contrôles sur les lignes visibles"
    ],
    results: [
      "Gain de temps sur les analyses répétitives",
      "Production plus homogène des synthèses",
      "Outils réutilisables sur plusieurs enquêtes"
    ],
    difficulties: [
      "Prendre en compte les réponses multiples et les filtres",
      "Éviter les modifications non souhaitées dans les feuilles existantes",
      "Rendre les macros suffisamment génériques sans perdre en lisibilité"
    ],
    review: [
      "Les réponses multiples et les filtres actifs ont été les deux difficultés principales",
      "J’ai dû faire attention à ne pas modifier le fonctionnement déjà attendu par les utilisateurs en ajoutant de nouvelles possibilités à la macro",
      "Je souhaite encore améliorer la documentation et découper davantage le code pour faciliter sa reprise"
    ],
    skills: ["C1 Traiter", "C3 Valoriser"],
    github: "https://github.com/git-khaled",
    demo: "https://git-khaled.github.io/"
  }
];

const cards = $("#cards");

function cardHTML(project){
  return `
    <article class="card" data-id="${project.id}" role="button" tabindex="0" aria-label="Ouvrir le projet ${project.title}">
      <div class="card__tag mono">${project.tag}</div>
      <div class="card__title">${project.title}</div>
      <p class="card__desc">${project.desc}</p>
      <div class="metaRow">
        ${project.meta.map(item => `<span class="meta">${item}</span>`).join("")}
      </div>
    </article>
  `;
}

function render(list){
  cards.innerHTML = list.map(cardHTML).join("");
  $$(".card[data-id]").forEach(card => {
    card.addEventListener("click", () => openModal(card.dataset.id));
    card.addEventListener("keydown", event => {
      if(event.key === "Enter" || event.key === " "){
        event.preventDefault();
        openModal(card.dataset.id);
      }
    });
  });
}
render(projects);

$$(".fbtn").forEach(button => {
  button.addEventListener("click", () => {
    $$(".fbtn").forEach(item => item.classList.remove("is-on"));
    button.classList.add("is-on");
    const filter = button.dataset.filter;
    render(filter === "all" ? projects : projects.filter(project => project.filter === filter));
  });
});

const modal = $("#modal");
const modalBox = $(".modal__box", modal);
let lastFocusedElement = null;

function fillList(selector, values){
  $(selector).innerHTML = values.map(value => `<li>${value}</li>`).join("");
}

function openModal(id){
  const project = projects.find(item => item.id === id);
  if(!project) return;

  lastFocusedElement = document.activeElement;

  $("#mTag").textContent = `${project.tag} • ${project.filter}`;
  $("#mTitle").textContent = project.title;
  $("#mProblem").textContent = project.problem;

  fillList("#mData", project.dataset);
  fillList("#mContribution", project.contribution);
  fillList("#mMethods", project.methods);
  fillList("#mResults", project.results);
  fillList("#mDifficulties", project.difficulties);
  fillList("#mReview", project.review);
  $("#mSkills").innerHTML = project.skills.map(skill => `<span class="meta">${skill}</span>`).join("");

  $("#mGithub").href = project.github;
  $("#mDemo").href = project.demo;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalBox.scrollTop = 0;

  requestAnimationFrame(() => modalBox.focus());
}

function closeModal(){
  if(!modal.classList.contains("is-open")) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if(lastFocusedElement instanceof HTMLElement){
    lastFocusedElement.focus();
  }
}

$$("[data-close]").forEach(element => element.addEventListener("click", closeModal));
document.addEventListener("keydown", event => {
  if(event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

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

/**
 * FreshIndex PRO | Creative Scientific Prediction Engine
 * Modélisation prédictive ASLT / Q10
 * Conçu par Yassine Boumeshoule, élève ingénieur à l'ENSA BM.
 */

'use strict';

// ============================================================
// 1. BASE DE DONNÉES BIOCHIMIQUES (Produits, Constantes & Sources)
// ============================================================
const PRODUCT_DB = {
  lait_pasteurise: {
    name: 'Lait pasteurisé', T_ref: 4, RH_ref: 80, DLC_ref: 7, q10: 2.8,
    rh_sensitivity: 0.35, ph_opt: 6.7, ph_k: 0.12, aw_ref: 0.990, aw_k: 6.5,
    f_open: 0.70, f_cold_break: 0.50, f_preservatives: 0.80, ph_default: 6.7, aw_default: 0.990,
    source: 'Labuza & Schmidl (1985) / ASTM E1960'
  },
  lait_uht: {
    name: 'Lait UHT', T_ref: 20, RH_ref: 60, DLC_ref: 180, q10: 2.5,
    rh_sensitivity: 0.08, ph_opt: 6.8, ph_k: 0.08, aw_ref: 0.990, aw_k: 4.5,
    f_open: 0.10, f_cold_break: 0.95, f_preservatives: 0.90, ph_default: 6.8, aw_default: 0.990,
    source: 'IDF Bulletin n°345 / ICH Q1A(R2)'
  },
  yaourt: {
    name: 'Yaourt fermenté', T_ref: 4, RH_ref: 75, DLC_ref: 21, q10: 2.2,
    rh_sensitivity: 0.25, ph_opt: 4.3, ph_k: 0.10, aw_ref: 0.980, aw_k: 5.0,
    f_open: 0.55, f_cold_break: 0.65, f_preservatives: 0.75, ph_default: 4.3, aw_default: 0.980,
    source: 'Codex Stan 243 / ComBase DB'
  },
  fromage: {
    name: 'Fromage (pâte molle)', T_ref: 4, RH_ref: 85, DLC_ref: 14, q10: 2.5,
    rh_sensitivity: 0.50, ph_opt: 5.8, ph_k: 0.10, aw_ref: 0.970, aw_k: 6.0,
    f_open: 0.65, f_cold_break: 0.50, f_preservatives: 0.85, ph_default: 5.5, aw_default: 0.970,
    source: 'ANSES Avis 2014-SA-0117 / ComBase'
  },
  viande: {
    name: 'Viande bovine fraîche', T_ref: 4, RH_ref: 80, DLC_ref: 4, q10: 3.0,
    rh_sensitivity: 0.40, ph_opt: 5.8, ph_k: 0.15, aw_ref: 0.990, aw_k: 7.0,
    f_open: 0.65, f_cold_break: 0.45, f_preservatives: 0.80, ph_default: 5.8, aw_default: 0.990,
    source: 'USDA-FSIS Meat Guidelines'
  },
  viande_hachee: {
    name: 'Viande hachée', T_ref: 4, RH_ref: 80, DLC_ref: 2, q10: 3.2,
    rh_sensitivity: 0.45, ph_opt: 6.0, ph_k: 0.18, aw_ref: 0.990, aw_k: 7.5,
    f_open: 0.55, f_cold_break: 0.40, f_preservatives: 0.75, ph_default: 5.8, aw_default: 0.990,
    source: 'USDA Pathogen Modeling Program'
  },
  poisson: {
    name: 'Poisson frais (cabillaud)', T_ref: 2, RH_ref: 85, DLC_ref: 3, q10: 3.5,
    rh_sensitivity: 0.40, ph_opt: 6.8, ph_k: 0.12, aw_ref: 0.990, aw_k: 7.0,
    f_open: 0.60, f_cold_break: 0.38, f_preservatives: 0.80, ph_default: 6.5, aw_default: 0.990,
    source: 'EFSA Journal (2010) / Huss et al.'
  },
  jus: {
    name: 'Jus de fruits frais', T_ref: 4, RH_ref: 70, DLC_ref: 10, q10: 2.0,
    rh_sensitivity: 0.15, ph_opt: 3.8, ph_k: 0.08, aw_ref: 0.970, aw_k: 4.5,
    f_open: 0.40, f_cold_break: 0.60, f_preservatives: 0.70, ph_default: 3.5, aw_default: 0.970,
    source: 'ComBase Yeast Modeling / Spoilage'
  },
  conserve: {
    name: 'Produit appertisé (conserve)', T_ref: 20, RH_ref: 60, DLC_ref: 1095, q10: 2.0,
    rh_sensitivity: 0.05, ph_opt: 6.5, ph_k: 0.05, aw_ref: 0.950, aw_k: 2.0,
    f_open: 0.04, f_cold_break: 0.98, f_preservatives: 0.90, ph_default: 6.0, aw_default: 0.950,
    source: 'Codex Alimentarius CAC/RCP 23-1979'
  }
};

const PRODUCT_ICONS = {
  lait_pasteurise: '<svg viewBox="0 0 24 24"><path d="M7 2h10v3l2 3v14H5V8l2-3V2zm2 2v2h6V4H9zm-2 5v11h10V9H7z"/></svg>',
  lait_uht:        '<svg viewBox="0 0 24 24"><path d="M4 2h16v20H4V2zm2 2v16h12V4H6zm3 4h6v2H9V8zm0 4h6v2H9v-2z"/></svg>',
  yaourt:          '<svg viewBox="0 0 24 24"><path d="M6 8l2-6h8l2 6v14H6V8zm2 2v10h8V10H8z"/></svg>',
  fromage:         '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5c0 .83-.67 1.5-1.5 1.5S7 15.33 7 14.5 7.67 13 8.5 13s1.5.67 1.5 1.5z"/></svg>',
  viande:          '<svg viewBox="0 0 24 24"><path d="M18.8 8.1l-2.9-2.9C15.1 4.4 14.1 4 13 4c-1.1 0-2.1.4-2.9 1.2L5.2 10.1c-1.6 1.6-1.6 4.2 0 5.8l2.9 2.9c.8.8 1.8 1.2 2.9 1.2 1.1 0 2.1-.4 2.9-1.2l4.9-4.9c1.6-1.6 1.6-4.2 0-5.8zM9.5 17.4l-2.9-2.9c-.8-.8-.8-2.1 0-2.9l4.9-4.9c.4-.4.9-.6 1.5-.6s1.1.2 1.5.6l2.9 2.9c.8.8.8 2.1 0 2.9l-4.9 4.9c-.8.8-2.1.8-2.9 0z"/></svg>',
  viande_hachee:   '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><circle cx="12" cy="14" r="1.5"/><circle cx="8" cy="14" r="1.5"/><circle cx="16" cy="14" r="1.5"/></svg>',
  poisson:         '<svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm4-9h-2v2h2v-2zm-6 0H8v2h2v-2z"/></svg>',
  jus:             '<svg viewBox="0 0 24 24"><path d="M7 2v2h10V2H7zm2 4l-2 16h10l-2-16H9zm2 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>',
  conserve:        '<svg viewBox="0 0 24 24"><path d="M4 6v12c0 2.21 3.58 4 8 4s8-1.79 8-4V6c0-2.21-3.58-4-8-4S4 3.79 4 6zm14 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM6 6c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm6 14c-3.31 0-6-1.34-6-3V9c1.66 1.34 4.34 2 6 2s4.34-.66 6-2v8c0 1.66-2.69 3-6 3z"/></svg>'
};

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('analysis-form');
  const resultsPanel = document.getElementById('results-panel');
  const gallery = document.getElementById('product-gallery');
  const inputProduit = document.getElementById('produit');
  
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');
  
  let chartInstance = null;

  // Initialisation de la date du jour par défaut
  document.getElementById('date_production').value = new Date().toISOString().split('T')[0];

  // ============================================================
  // 2. CURSEUR INTERACTIF GLOW ET GESTION DU HOVER
  // ============================================================
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Positionnement instantané du micro-point central
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  // Animation avec inertie (filtre passe-bas) pour le halo lumineux
  function renderCursor() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    
    cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Délégation d'événement pour l'expansion du curseur sur les éléments interactifs
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .product-card, input, label, select, .cb-wrap')) {
      cursorDot.classList.add('hovered');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .product-card, input, label, select, .cb-wrap')) {
      cursorDot.classList.remove('hovered');
    }
  });



  // ============================================================
  // 4. GÉNÉRATION DYNAMIQUE DU SÉLECTEUR DE MATRICES
  // ============================================================
  for (const [key, p] of Object.entries(PRODUCT_DB)) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="card-icon">${PRODUCT_ICONS[key]}</div>
      <div class="card-name">${p.name}</div>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.product-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      inputProduit.value = key;
      document.getElementById('ph').value = p.ph_default;
      document.getElementById('aw').value = p.aw_default.toFixed(3);
    });
    gallery.appendChild(card);
  }

  // Permettre le glissement horizontal fluide de la galerie (souris/drag)
  let isDown = false;
  let startX;
  let scrollLeft;
  const wrapper = document.querySelector('.gallery-wrapper');

  wrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });
  wrapper.addEventListener('mouseleave', () => isDown = false);
  wrapper.addEventListener('mouseup', () => isDown = false);
  wrapper.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 1.8;
    wrapper.scrollLeft = scrollLeft - walk;
  });

  // ============================================================
  // 5. MODÉLISATION MATHÉMATIQUE ASLT (ALGORITHME Q10)
  // ============================================================
  function calcShelfLife(key, T, RH, pH, aw, isOpen, coldBreak, preserv, daysElapsed) {
    const p = PRODUCT_DB[key];
    
    // Facteur Q10 thermique
    const fT  = Math.pow(p.q10, (T - p.T_ref) / 10);
    
    // Facteur d'Humidité relative
    const fRH = (p.sealed && !isOpen) ? 1.0 : Math.max(0.5, Math.min(3.0, Math.pow(Math.max(5, RH) / Math.max(1, p.RH_ref), p.rh_sensitivity)));
    
    // Facteur pH (Fonction Rosso / Écart optimal)
    const dPH = pH - p.ph_opt;
    const fPH = Math.max(0.35, Math.min(2.5, dPH >= 0 ? 1 + p.ph_k * dPH : 1 / (1 + p.ph_k * (-dPH))));
    
    // Facteur aw (Activité de l'eau libre - Équation d'Arrhenius-Sorption)
    const fAW = Math.max(0.3, Math.min(4.0, Math.exp(p.aw_k * (aw - p.aw_ref))));

    // Taux d'accélération brut (AF)
    let AF = fT * fRH * fPH * fAW;
    
    // Inhibition par conservateurs
    if (preserv) {
      AF *= p.f_preservatives;
    }

    // Durée de vie projetée théorique
    let DLC_est = p.DLC_ref / AF;
    
    // Pénalités de manipulation physique
    if (isOpen) DLC_est *= p.f_open;
    if (coldBreak) DLC_est *= p.f_cold_break;

    // Limites de garde physiques
    DLC_est = Math.max(0.1, Math.min(p.DLC_ref * 25, DLC_est));
    
    return { 
      p, fT, fRH, fPH, fAW, AF, DLC_est, 
      daysRemaining: DLC_est - daysElapsed 
    };
  }

  // ============================================================
  // 6. SOUMISSION ET RENDU DES RÉSULTATS SCIENTIFIQUES
  // ============================================================
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const key = inputProduit.value;
    if (!key) {
      alert("Erreur opérationnelle : Sélectionnez d'abord une matrice alimentaire dans l'étape 01.");
      return;
    }

    // Retrait des classes d'affichage pour forcer le redéclenchement de la transition CSS
    resultsPanel.classList.remove('show');
    resultsPanel.classList.add('hidden');

    setTimeout(() => {
      processAndRender(key);
    }, 100);
  });

  // Rendu de la prédiction avec explications détaillées et sources
  function processAndRender(key) {
    const T = parseFloat(document.getElementById('temperature').value);
    const RH = parseFloat(document.getElementById('humidite').value);
    const pH = parseFloat(document.getElementById('ph').value);
    const aw = parseFloat(document.getElementById('aw').value);
    const isOpen = document.getElementById('produit_ouvert').checked;
    const coldBreak = document.getElementById('rupture_froid').checked;
    const preserv = document.getElementById('conservateurs').checked;

    const dateProdVal = document.getElementById('date_production').value;
    const dateProd = new Date(dateProdVal);
    const elapsed = Math.max(0, (Date.now() - dateProd.getTime()) / 86400000);

    const res = calcShelfLife(key, T, RH, pH, aw, isOpen, coldBreak, preserv, elapsed);
    
    // --- 1. TITRE DE LA MATRICE ET INDICATEUR D'ÉTAT ---
    document.getElementById('res-product-title').textContent = res.p.name;
    
    const rJours = document.getElementById('res-jours');
    const rStatusVisual = document.getElementById('res-status-visual');
    const rStatusText = document.getElementById('res-status-visual-text');
    const mainCard = document.getElementById('main-result-card');
    
    // Détermination de la criticité de l'état résiduel
    let statusClass = "safe";
    let statusGlow = "var(--safe-glow)";
    let statusText = "SÛR (CONSERVATION EXCELLENTE)";
    let daysString = "";

    if (res.daysRemaining <= 0) {
      statusClass = "danger";
      statusGlow = "var(--danger-glow)";
      statusText = "MATRICE PÉRIMÉE";
      daysString = "PÉRIMÉ";
      rJours.style.color = "var(--danger)";
    } else {
      const ratio = res.daysRemaining / res.p.DLC_ref;
      if (ratio < 0.25) {
        statusClass = "caution";
        statusGlow = "var(--caution-glow)";
        statusText = "ALERTE / ALTÉRATION IMMINENTE";
        rJours.style.color = "var(--caution)";
      } else {
        statusClass = "safe";
        statusGlow = "var(--safe-glow)";
        statusText = "CONSERVATION OPTIMALE";
        rJours.style.color = "var(--safe)";
      }
      
      // Formatage de l'unité (heures vs jours)
      daysString = res.daysRemaining < 1 
        ? `${(res.daysRemaining * 24).toFixed(0)} HEURES` 
        : `${res.daysRemaining.toFixed(0)} JOURS`;
    }

    // Mise à jour de l'indicateur visuel et de la lueur de la carte
    rStatusText.textContent = res.daysRemaining <= 0 ? "Périmé" : (res.daysRemaining / res.p.DLC_ref < 0.25 ? "Alerte" : "Optimal");
    const statusLight = rStatusVisual.querySelector('.status-light-core');
    const pulseRing = rStatusVisual.querySelector('.pulse-ring');
    
    // Application dynamique des couleurs
    let themeColor = "var(--safe)";
    if (statusClass === "caution") themeColor = "var(--caution)";
    if (statusClass === "danger") themeColor = "var(--danger)";
    
    statusLight.style.backgroundColor = themeColor;
    statusLight.style.boxShadow = `0 0 20px ${statusGlow}, 0 0 40px ${statusGlow}`;
    pulseRing.style.borderColor = themeColor;
    
    mainCard.style.borderColor = `rgba(var(--${statusClass}-rgb), 0.35)`;
    mainCard.style.boxShadow = `0 35px 70px rgba(var(--${statusClass}-rgb), 0.06)`;

    // Animation d'incrémentation fluide du résultat principal (Count Up)
    animateResultValue(rJours, daysString, res.daysRemaining <= 0, 1000);

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + Math.max(0, res.daysRemaining));
    document.getElementById('res-date').textContent = res.daysRemaining <= 0 ? "Non applicable" : expDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // --- 2. IMPACT DÉTAILLÉ ET JUSTIFICATION SCIENTIFIQUE DES FACTEURS (LE POURQUOI & LA SOURCE) ---
    const formatImp = (v) => {
      if (v > 1.05) return `<span class="factor-impact-badge badge-accel">Cinétique Accélérée (×${v.toFixed(2)})</span>`;
      if (v < 0.95) return `<span class="factor-impact-badge badge-slow">Cinétique Inhibitrice (×${v.toFixed(2)})</span>`;
      return `<span class="factor-impact-badge badge-neut">Stabilité Neutre</span>`;
    };

    // Construction HTML du tableau des facteurs
    let factorsHTML = `
      <div class="factor-item">
        <div class="factor-top-line">
          <div class="factor-meta-left">
            <span class="factor-title">Variation Thermique (${T}°C)</span>
            <span class="factor-origin-val">Valeur de référence : ${res.p.T_ref}°C | Q10 : ${res.p.q10}</span>
          </div>
          ${formatImp(res.fT)}
        </div>
        <p class="factor-explanation">
          <strong>Pourquoi :</strong> La température gouverne l'activité métabolique et enzymatique des bactéries (règle d'Arrhenius). Chaque élévation de température augmente la constante cinétique de détérioration, activant les réactions microbiennes de rancissement et d'acidification.
        </p>
        <span class="factor-source">Source : Travaux de Labuza sur les cinétiques alimentaires (1985)</span>
      </div>

      <div class="factor-item">
        <div class="factor-top-line">
          <div class="factor-meta-left">
            <span class="factor-title">Hygrométrie de Stockage (${RH}%)</span>
            <span class="factor-origin-val">Valeur de référence : ${res.p.RH_ref}% | Sensibilité : ${res.p.rh_sensitivity}</span>
          </div>
          ${formatImp(res.fRH)}
        </div>
        <p class="factor-explanation">
          <strong>Pourquoi :</strong> L'humidité relative de l'air ambiant interagit directement avec l'eau de surface libre du produit si l'emballage est perméable ou ouvert. Une hygrométrie excessive empêche la déshydratation barrière superficielle et crée un environnement optimal pour la prolifération des moisissures et bactéries aérobies.
        </p>
        <span class="factor-source">Source : Chirife & Fontan - Isothermes de Sorption (1982)</span>
      </div>

      <div class="factor-item">
        <div class="factor-top-line">
          <div class="factor-meta-left">
            <span class="factor-title">Potentiel Hydrogène Interne (pH ${pH})</span>
            <span class="factor-origin-val">Valeur optimale pour la croissance : pH ${res.p.ph_opt}</span>
          </div>
          ${formatImp(res.fPH)}
        </div>
        <p class="factor-explanation">
          <strong>Pourquoi :</strong> L'acidité du milieu altère le gradient électrochimique et la force proton-motrice transmembranaire des micro-organismes. Un écart par rapport au pH optimal du produit perturbe l'homéostasie intracellulaire de la bactérie, dénature ses enzymes et ralentit ou arrête sa division cellulaire.
        </p>
        <span class="factor-source">Source : Booth - Régulation du pH interne bactérien (1985) / Base ComBase</span>
      </div>

      <div class="factor-item">
        <div class="factor-top-line">
          <div class="factor-meta-left">
            <span class="factor-title">Activité de l'Eau de la Matrice (aw ${aw})</span>
            <span class="factor-origin-val">Valeur de référence matricielle : aw ${res.p.aw_ref}</span>
          </div>
          ${formatImp(res.fAW)}
        </div>
        <p class="factor-explanation">
          <strong>Pourquoi :</strong> L'activité de l'eau (aw) représente la quantité d'eau libre disponible pour le transport de nutriments et les réactions métaboliques. Une aw basse déclenche un choc osmotique, forçant l'eau à quitter la cellule bactérienne (plasmolyse), ce qui allonge drastiquement la phase de latence microbiologique.
        </p>
        <span class="factor-source">Source : Christian - Effets osmotiques sur la viabilité microbienne (1980)</span>
      </div>
    `;

    // Ajouts conditionnels selon les pénalités cochées
    if (isOpen) {
      factorsHTML += `
        <div class="factor-item">
          <div class="factor-top-line">
            <div class="factor-meta-left">
              <span class="factor-title">Conditionnement Altéré (Emballage Ouvert)</span>
              <span class="factor-origin-val">Multiplicateur d'altération : ×${(1/res.p.f_open).toFixed(2)}</span>
            </div>
            <span class="factor-impact-badge badge-accel">Cinétique Accélérée</span>
          </div>
          <p class="factor-explanation">
            <strong>Pourquoi :</strong> La rupture de l'étanchéité de l'emballage sature la matrice alimentaire en oxygène atmosphérique gazeux. Cela supprime l'atmosphère protectrice (sous CO2/N2) et favorise le développement exponentiel des germes d'altération aérobies stricts tels que les <em>Pseudomonas</em>.
          </p>
          <span class="factor-source">Source : Gram & Huss - Évolution microbiologique des aliments frais (1996)</span>
        </div>
      `;
    }

    if (coldBreak) {
      factorsHTML += `
        <div class="factor-item">
          <div class="factor-top-line">
            <div class="factor-meta-left">
              <span class="factor-title">Rupture du Froid (Choc Thermique)</span>
              <span class="factor-origin-val">Multiplicateur d'altération : ×${(1/res.p.f_cold_break).toFixed(2)}</span>
            </div>
            <span class="factor-impact-badge badge-accel">Cinétique Accélérée</span>
          </div>
          <p class="factor-explanation">
            <strong>Pourquoi :</strong> Une excursion temporaire de température brise la latence des cellules bactériennes psychrotrophes. Le retour ultérieur au froid n'inverse pas le réveil physiologique entamé, projetant immédiatement la flore dans sa phase de croissance exponentielle active.
          </p>
          <span class="factor-source">Source : McKellar et al. - Dynamiques de latence thermique (1997)</span>
        </div>
      `;
    }

    if (preserv) {
      factorsHTML += `
        <div class="factor-item">
          <div class="factor-top-line">
            <div class="factor-meta-left">
              <span class="factor-title">Agents Conservateurs (Inhibiteurs Additifs)</span>
              <span class="factor-origin-val">Coefficient d'inhibition : ×${res.p.f_preservatives.toFixed(2)}</span>
            </div>
            <span class="factor-impact-badge badge-slow">Cinétique Inhibitrice</span>
          </div>
          <p class="factor-explanation">
            <strong>Pourquoi :</strong> Les acides organiques faibles présents sous forme non dissociée s'infiltrent à travers la membrane cellulaire bactérienne. Une fois à l'intérieur du cytoplasme neutre, ils libèrent des protons, provoquant une acidification interne que la bactérie tente d'évacuer au détriment de ses réserves énergétiques en ATP.
          </p>
          <span class="factor-source">Source : Davidson - Antimicrobiens dans les aliments (2001)</span>
        </div>
      `;
    }

    document.getElementById('factors-list').innerHTML = factorsHTML;

    // --- 3. DÉCOMPOSITION ANALYTIQUE DES CALCULS ET DETAILS PAR VALEUR ---
    document.getElementById('calc-steps').innerHTML = `
      <div class="calc-step-row">
        <span class="calc-step-num">Étape A</span>
        <div class="calc-step-content">
          <span class="calc-step-title">Initialisation de la Constante Statique du Produit</span>
          <p class="calc-step-desc">
            Le modèle prédit la stabilité à partir de la durée limite de consommation standard (DLC_ref) déterminée en laboratoire de référence sous une température de stockage spécifiée (T_ref).
          </p>
          <div class="calc-step-formula">
            DLC_ref = ${res.p.DLC_ref} jours | Température de référence (T_ref) = ${res.p.T_ref}°C
          </div>
          <span class="calc-step-source">Source des constantes de départ : ${res.p.source}</span>
        </div>
      </div>

      <div class="calc-step-row">
        <span class="calc-step-num">Étape B</span>
        <div class="calc-step-content">
          <span class="calc-step-title">Calcul de la Thermocinétique (Facteur Thermique fT)</span>
          <p class="calc-step-desc">
            La variation de vitesse de dégradation liée à l'énergie d'activation thermique est calculée par la loi du coefficient Q10.
          </p>
          <div class="calc-step-formula">
            fT = Q10 ^ ((T - T_ref) / 10) = ${res.p.q10} ^ ((${T} - ${res.p.T_ref}) / 10) = ${res.fT.toFixed(4)}
          </div>
          <span class="calc-step-source">Source physique : Modèle cinétique empirique ASTM E1960</span>
        </div>
      </div>

      <div class="calc-step-row">
        <span class="calc-step-num">Étape C</span>
        <div class="calc-step-content">
          <span class="calc-step-title">Calcul de la Sorption d'Eau (Facteur d'Humidité fRH)</span>
          <p class="calc-step-desc">
            Détermination de l'impact hygrométrique externe sur l'humidité superficielle libre, pondéré par la sensibilité de la matrice.
          </p>
          <div class="calc-step-formula">
            fRH = (RH / RH_ref) ^ rh_sensitivity = (${RH} / ${res.p.RH_ref}) ^ ${res.p.rh_sensitivity} = ${res.fRH.toFixed(4)}
          </div>
          <span class="calc-step-source">Source d'équilibre de phase : Isothermes de sorption de Labuza (1984)</span>
        </div>
      </div>

      <div class="calc-step-row">
        <span class="calc-step-num">Étape D</span>
        <div class="calc-step-content">
          <span class="calc-step-title">Modulations Biochimiques de la Matrice (fPH & fAW)</span>
          <p class="calc-step-desc">
            Les écarts de l'activité de l'eau libre (aw) et du pH par rapport à leurs valeurs basales sont calculés via des fonctions cardinales.
          </p>
          <div class="calc-step-formula">
            fPH = ${res.fPH.toFixed(4)} (Déviation du pH optimal ${res.p.ph_opt}) <br>
            fAW = exp(aw_k * (aw - aw_ref)) = exp(${res.p.aw_k} * (${aw} - ${res.p.aw_ref})) = ${res.fAW.toFixed(4)}
          </div>
          <span class="calc-step-source">Source d'adaptation microbiologique : ComBase Growth Database / Modèles de Rosso</span>
        </div>
      </div>

      <div class="calc-step-row">
        <span class="calc-step-num">Étape E</span>
        <div class="calc-step-content">
          <span class="calc-step-title">Résolution du Facteur Global d'Accélération Cinétique (AF)</span>
          <p class="calc-step-desc">
            Le taux global d'accélération combine multiplicativement les stress biochimiques et le coefficient d'inhibition des conservateurs.
          </p>
          <div class="calc-step-formula">
            AF = fT * fRH * fPH * fAW * [Conservateurs] = ${res.fT.toFixed(3)} * ${res.fRH.toFixed(3)} * ${res.fPH.toFixed(3)} * ${res.fAW.toFixed(3)} ${preserv ? ' * ' + res.p.f_preservatives.toFixed(2) : ''} = ${res.AF.toFixed(4)}
          </div>
          <span class="calc-step-source">Source théorique : Formulation d'accélération d'altération cinétique de Labuza</span>
        </div>
      </div>

      <div class="calc-step-row">
        <span class="calc-step-num">Étape F</span>
        <div class="calc-step-content">
          <span class="calc-step-title">Calcul Final de la DLC Résiduelle Prédictive</span>
          <p class="calc-step-desc">
            La DLC résiduelle projetée applique le facteur d'accélération (AF) à la DLC de référence, déduit les pénalités physiques et soustrait le temps déjà écoulé.
          </p>
          <div class="calc-step-formula">
            DLC_projetée = (DLC_ref / AF) * [Pénalités] - Jours_écoulés <br>
            = (${res.p.DLC_ref} / ${res.AF.toFixed(3)}) ${isOpen ? ' * ' + res.p.f_open.toFixed(2) : ''} ${coldBreak ? ' * ' + res.p.f_cold_break.toFixed(2) : ''} - ${elapsed.toFixed(2)} = ${res.daysRemaining.toFixed(2)} jours restants
          </div>
          <span class="calc-step-source">Source logicielle : Algorithme prédictif ShelfLifeAI - Y. Boumeshoule (ENSA BM)</span>
        </div>
      </div>
    `;

    // --- 4. TRACÉ DU GRAPHIQUE D'ALTÉRATION PRÉDICTIVE ---
    drawChart(res.DLC_est, elapsed, themeColor);

    // Déclenchement de l'animation d'apparition
    resultsPanel.classList.remove('hidden');
    void resultsPanel.offsetWidth; // Force le reflow du DOM pour redémarrer l'animation
    resultsPanel.classList.add('show');

    // Appliquer un effet de balayage visuel "Laser/Scanline" sur les cartes de résultats
    document.querySelectorAll('.result-card').forEach(card => {
      card.classList.add('scanning-scanline');
      setTimeout(() => {
        card.classList.remove('scanning-scanline');
      }, 2000);
    });

    // Scroll fluide vers les résultats
    setTimeout(() => { 
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
    }, 250);
  }

  // ============================================================
  // 7. FONCTION DE DESSIN DU GRAPHIQUE D'ALTÉRATION
  // ============================================================
  function drawChart(dlcEst, elapsed, chartColor) {
    const ctx = document.getElementById('freshnessChart').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
    }

    const maxDays = Math.ceil(dlcEst * 1.15); 
    const labels = []; 
    const data = [];

    // Division intelligente de l'axe X pour le tracé de la courbe
    const steps = maxDays > 45 ? Math.ceil(maxDays / 45) : 1;
    for (let i = 0; i <= maxDays; i += steps) {
      labels.push(i);
      data.push(Math.max(-20, 100 * (1 - (i / dlcEst))));
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data, 
          borderColor: chartColor, 
          backgroundColor: chartColor.replace(')', ', 0.08)').replace('rgb', 'rgba'),
          borderWidth: 2.5, 
          fill: true, 
          tension: 0.35, 
          pointRadius: 0
        }]
      },
      options: {
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false }, 
          tooltip: { enabled: false },
          annotation: {
            annotations: {
              lineElapsed: {
                type: 'line',
                xMin: elapsed,
                xMax: elapsed,
                borderColor: '#14241F',
                borderWidth: 1.5,
                borderDash: [5, 5],
                label: {
                  display: true,
                  content: `Aujourd'hui (${elapsed.toFixed(1)} jrs)`,
                  position: 'start',
                  backgroundColor: 'rgba(20, 36, 31, 0.85)',
                  color: '#fff',
                  font: { family: 'IBM Plex Mono', size: 9, weight: 'normal' },
                  padding: 4
                }
              },
              lineLimit: {
                type: 'line',
                xMin: dlcEst,
                xMax: dlcEst,
                borderColor: 'rgba(155, 44, 44, 0.7)',
                borderWidth: 1.5,
                borderDash: [3, 3],
                label: {
                  display: true,
                  content: 'DLC théorique projetée',
                  position: 'end',
                  backgroundColor: 'rgba(155, 44, 44, 0.85)',
                  color: '#fff',
                  font: { family: 'IBM Plex Mono', size: 9, weight: 'normal' },
                  padding: 4
                }
              }
            }
          }
        },
        scales: {
          x: { 
            grid: { color: 'rgba(20, 36, 31, 0.04)' },
            title: {
              display: true,
              text: 'Temps (jours de conservation)',
              font: { family: 'Space Grotesk', size: 10, weight: 600 },
              color: '#5C6B66'
            },
            ticks: {
              font: { family: 'IBM Plex Mono', size: 10 }
            }
          },
          y: { 
            min: -20, 
            max: 100,
            grid: { color: 'rgba(20, 36, 31, 0.04)' },
            title: {
              display: true,
              text: 'Niveau de fraîcheur résiduel (%)',
              font: { family: 'Space Grotesk', size: 10, weight: 600 },
              color: '#5C6B66'
            },
            ticks: {
              font: { family: 'IBM Plex Mono', size: 10 }
            }
          }
        }
      }
    });
  }

  // Animation fluide d'incrémentation du résultat principal
  function animateResultValue(obj, targetVal, isExpired, duration) {
    let startTimestamp = null;
    const isHours = targetVal.includes("HEURES");
    const targetNum = isExpired ? 0 : parseFloat(targetVal);
    const suffix = isExpired ? "" : (isHours ? " HEURES" : " JOURS");
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const val = progress * targetNum;
      
      if (isExpired) {
        obj.textContent = "PÉRIMÉ";
      } else {
        obj.textContent = `${val.toFixed(0)}${suffix}`;
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = targetVal;
      }
    };
    window.requestAnimationFrame(step);
  }

});

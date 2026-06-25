/**
 * FreshIndex PRO | Creative Scientific Prediction Engine
 * Modélisation prédictive ASLT / Arrhenius
 * Conçu par Yassine Boumeshoule, élève ingénieur à l'ENSA BM.
 */

'use strict';

// ============================================================
// 1. DICTIONNAIRE DE TRADUCTION BILINGUE (FR / AR)
// ============================================================
const i18n = {
  fr: {
    firstName: "Yassine",
    lastName: "Boumeshoule",
    sig: "BOUMESHOULE YASSINE",
    badge: "MODÉLISATION DE LA DURÉE DE CONSERVATION (ASLT / ARRHENIUS)",
    role: "Élève Ingénieur en Cycle d'Ingénieur",
    school: "École Nationale des Sciences Appliquées de Béni Mellal (ENSA BM)",
    step1: "Sélection de la Matrice Alimentaire",
    step2: "Paramètres Physico-Chimiques & Environnementaux",
    basicParams: "Paramètres de base",
    temp: "Température de stockage (°C)",
    pack: "Type d'emballage visible",
    packOpen: "Non emballé / Perméable",
    packVac: "Sous vide",
    packMap: "Atmosphère Modifiée (MAP)",
    preserv: "Présence de conservateurs",
    yes: "Oui",
    no: "Non",
    dk: "Je ne sais pas",
    penalties: "Pénalités Physiques",
    cbOpen: "Produit ouvert",
    cbCold: "Rupture chaîne du froid",
    advToggle: "Réglages Avancés (Laboratoire)",
    rh: "Humidité Ambiante (%)",
    rhHint: "L'humidité n'affecte que les produits non scellés.",
    phLabel: "Potentiel Hydrogène (pH)",
    awLabel: "Activité de l'eau (aw)",
    awHint: "Ajustez directement cette valeur si le produit contient beaucoup de sel/sucre (Norrish).",
    light: "Exposition à la lumière",
    lightLow: "Faible",
    lightHigh: "Forte",
    sig: "BOUMESHOULE YASSINE",
    statusTag: "MODÈLE CINÉTIQUE ASLT",
    heroLabel: "DURÉE DE CONSERVATION ESTIMÉE",
    statusGauge: "Indice",
    factorsTitle: "Influence Logique des Facteurs",
    mathTitle: "Décomposition Mathématique (Arrhenius)",
    mathIntro: "La méthode ASLT utilise l'équation d'Arrhenius : la durée de vie de référence est accélérée ou ralentie exponentiellement selon l'énergie d'activation (Ea) du produit et l'écart de température de stockage.",
    chartTitle: "Évolution de l'Indice de Fraîcheur",
    sourcesTitle: "Références Scientifiques Utilisées",
    warning: "⚠️ Attention : Cet outil fournit une estimation basée sur des modèles scientifiques prédictifs généraux. Il ne remplace en aucun cas une analyse microbiologique en laboratoire ni les dates limites officielles de consommation (DLC/DDM) fixées par les fabricants.",
    chartExplanation: "Ce graphique illustre la dégradation progressive de la fraîcheur du produit dans le temps. Il aide à visualiser rapidement le point critique (0%) où la limite de sécurité microbiologique ou physico-chimique est dépassée.",
    methBtn: "Lire la Méthodologie Complète",
    methTitle: "Méthodologie Scientifique",
    feedbackTitle: "Vos suggestions & Améliorations",
    feedbackDesc: "Avez-vous une idée pour améliorer ce modèle ? Envoyez-moi un email !",
    feedbackPlaceholder: "Écrivez votre message ici...",
    feedbackBtn: "Envoyer l'idée",
    day: "jour",
    days: "jours",
    expired: "Périmé",
    to: "à"
  },
  ar: {
    firstName: "ياسين",
    lastName: "بومسهول",
    sig: "ياسين بومسهول",
    badge: "نمذجة فترة الصلاحية (ASLT / ARRHENIUS)",
    role: "طالب مهندس في سلك المهندسين",
    school: "المدرسة الوطنية للعلوم التطبيقية ببني ملال (ENSA BM)",
    step1: "اختيار المادة الغذائية",
    step2: "المعايير الفيزيائية الكيميائية والبيئية",
    basicParams: "المعايير الأساسية",
    temp: "درجة حرارة التخزين (مئوية)",
    pack: "نوع التغليف المرئي",
    packOpen: "غير مغلف / قابل للنفاذ",
    packVac: "مفرغ من الهواء",
    packMap: "جو معدل (MAP)",
    preserv: "وجود مواد حافظة",
    yes: "نعم",
    no: "لا",
    dk: "لا أعلم",
    penalties: "عقوبات فيزيائية",
    cbOpen: "منتج مفتوح",
    cbCold: "انقطاع سلسلة التبريد",
    advToggle: "إعدادات متقدمة (مختبر)",
    rh: "الرطوبة المحيطة (%)",
    rhHint: "تؤثر الرطوبة فقط على المنتجات غير محكمة الغلق.",
    phLabel: "الرقم الهيدروجيني (pH)",
    awLabel: "النشاط المائي (aw)",
    awHint: "قم بتعديل هذه القيمة مباشرة إذا كان المنتج يحتوي على الكثير من الملح/السكر.",
    light: "التعرض للضوء",
    lightLow: "ضعيف",
    lightHigh: "قوي",
    sig: "بومشول ياسين",
    statusTag: "نموذج حركي ASLT",
    heroLabel: "فترة الصلاحية المقدرة",
    statusGauge: "مؤشر",
    factorsTitle: "التأثير المنطقي للعوامل",
    mathTitle: "التحليل الرياضي (أرينيوس)",
    mathIntro: "تستخدم طريقة ASLT معادلة أرينيوس: يتم تسريع أو إبطاء العمر الافتراضي المرجعي بشكل أسي وفقًا لطاقة التنشيط (Ea) للمنتج والفرق في درجة حرارة التخزين.",
    chartTitle: "تطور مؤشر النضارة",
    sourcesTitle: "المراجع العلمية المستخدمة",
    warning: "⚠️ تحذير: توفر هذه الأداة تقديرًا استنادًا إلى نماذج علمية تنبؤية عامة. ولا تحل بأي حال من الأحوال محل التحليل الميكروبيولوجي في المختبر أو المواعيد النهائية للاستهلاك الرسمية التي يحددها المصنعون.",
    chartExplanation: "يوضح هذا الرسم البياني التدهور التدريجي لنضارة المنتج بمرور الوقت. يساعد في تصور النقطة الحرجة (0٪) التي يتم فيها تجاوز حد السلامة الميكروبيولوجية أو الكيميائية بسرعة.",
    methBtn: "اقرأ المنهجية الكاملة",
    methTitle: "المنهجية العلمية",
    feedbackTitle: "اقتراحاتكم وتحسيناتكم",
    feedbackDesc: "هل لديك فكرة لتحسين هذا النموذج؟ أرسل لي بريداً إلكترونياً!",
    feedbackPlaceholder: "اكتب رسالتك أو اقتراحك هنا...",
    feedbackBtn: "إرسال الفكرة",
    day: "يوم",
    days: "أيام",
    expired: "منتهي الصلاحية",
    to: "إلى"
  },
  ma: {
    firstName: "ياسين",
    lastName: "بومسهول",
    sig: "ياسين بومسهول",
    badge: "حساب مدة الصلاحية (ASLT / ARRHENIUS)",
    role: "طالب مهندس ف سلك المهندسين",
    school: "المدرسة الوطنية للعلوم التطبيقية ببني ملال (ENSA BM)",
    step1: "عزل المادة الغذائية",
    step2: "الظروف الفيزيائية والبيئية",
    basicParams: "الظروف الأساسية",
    temp: "درجة حرارة التخزين (مئوية)",
    pack: "نوع التغليف",
    packOpen: "محلولة / ما مغلفاش",
    packVac: "تحت الفيد (مفرغ من الهواء)",
    packMap: "جو معدل (MAP)",
    preserv: "واش فيها مواد حافظة",
    yes: "أيه",
    no: "لا",
    dk: "ما عرفتش",
    penalties: "تأثيرات سلبية",
    cbOpen: "المنتوج محلول",
    cbCold: "سلسلة التبريد تقطعات",
    advToggle: "إعدادات متقدمة (المختبر)",
    rh: "الرطوبة المحيطة (%)",
    rhHint: "الرطوبة كتأثر غير يلا كان المنتوج محلول.",
    phLabel: "درجة الحموضة (pH)",
    awLabel: "النشاط المائي (aw)",
    awHint: "بدل هاد القيمة يلا كان المنتوج فيه بزاف ديال الملحة أو السكر.",
    light: "التعرض للضو",
    lightLow: "قليل",
    lightHigh: "بزاف",
    statusTag: "نموذج حركي ASLT",
    heroLabel: "مدة الصلاحية المتوقعة",
    statusGauge: "المؤشر",
    factorsTitle: "كيفاش هاد العوامل كتأثر",
    mathTitle: "الحساب الرياضي (أرينيوس)",
    mathIntro: "طريقة ASLT كتخدم بمعادلة أرينيوس: مدة الصلاحية كتزيد ولا كتقص على حساب طاقة التنشيط (Ea) والفرق فدرجة الحرارة.",
    chartTitle: "تطور مؤشر الطراوة",
    sourcesTitle: "المراجع العلمية لي خدمنا بيها",
    warning: "⚠️ رد البال: هاد الأداة كتعطي غير تقدير مبني على نماذج علمية. هادشي ما كيعوضش التحليل فالمختبر ولا التاريخ لي كتحطو الشركة.",
    chartExplanation: "هاد المبيان كيبين كيفاش الطراوة ديال المنتوج كتنقص مع الوقت. كيعاونك تشوف بالزربة النقطة الحرجة (0٪) فين كتولي الماكلة خاسرة ومخصهاش تتكال.",
    methBtn: "اقرا المنهجية كاملة",
    methTitle: "المنهجية العلمية",
    feedbackTitle: "اقتراحاتكم باش نحسنو الموقع",
    feedbackDesc: "عندك شي فكرة باش نزيدو القدام بهاد الموديل؟ صيفط ليا إيميل ديريكت!",
    feedbackPlaceholder: "كتب الفكرة ولا الملاحظة ديالك هنا...",
    feedbackBtn: "صيفط الاقتراح",
    expired: "خاسر",
    to: "تال"
  }
};

let currentLang = 'fr';

// ============================================================
// 2. BASE DE DONNÉES BIOCHIMIQUES (Produits, Ea & Sources)
// ============================================================
// rh_sensitivity et ph_k ont été augmentés pour un impact clair et fort des curseurs
const PRODUCT_DB = {
  lait_pasteurise: {
    name: { fr: 'Lait pasteurisé', ar: 'حليب مبستر', ma: 'حليب مبستر' },
    T_ref: 4, RH_ref: 80, DLC_ref: 7, Ea: 66.7, // kJ/mol
    rh_sensitivity: 2.5, ph_opt: 6.7, ph_k: 1.5, aw_ref: 0.990, aw_k: 6.5,
    f_open: 0.70, f_cold_break: 0.50, f_preservatives: 0.80, ph_default: 6.7, aw_default: 0.990,
    theme: { bg: '#EBF3F5', text: '#14241F', textMuted: '#5C6B66', accent: '#72A4B5' },
    sourceEa: 'https://emerginginvestigators.org/articles/22-023/pdf'
  },
  viande: {
    name: { fr: 'Viande fraîche', ar: 'لحم طازج', ma: 'لحم طري' },
    T_ref: 4, RH_ref: 80, DLC_ref: 4, Ea: 106.9,
    rh_sensitivity: 2.8, ph_opt: 5.8, ph_k: 1.8, aw_ref: 0.990, aw_k: 7.0,
    f_open: 0.65, f_cold_break: 0.45, f_preservatives: 0.80, ph_default: 5.8, aw_default: 0.990,
    theme: { bg: '#4A1515', text: '#FFFFFF', textMuted: '#FFCACA', accent: '#B83232' },
    sourceEa: 'https://www.academia.edu/118108217/Determination_of_TDP_and_TDT_value_for_spoilage_bacteria'
  },
  poisson: {
    name: { fr: 'Poisson frais', ar: 'سمك طازج', ma: 'حوت طري' },
    T_ref: 2, RH_ref: 85, DLC_ref: 3, Ea: 80.0,
    rh_sensitivity: 2.8, ph_opt: 6.8, ph_k: 1.6, aw_ref: 0.990, aw_k: 7.0,
    f_open: 0.60, f_cold_break: 0.38, f_preservatives: 0.80, ph_default: 6.5, aw_default: 0.990,
    theme: { bg: '#1A2B4C', text: '#FFFFFF', textMuted: '#B3C6E5', accent: '#4A78C4' },
    sourceEa: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC92181/'
  },
  jus: {
    name: { fr: 'Jus de fruits', ar: 'عصير فواكه', ma: 'عصير' },
    T_ref: 4, RH_ref: 70, DLC_ref: 10, Ea: 42.0,
    rh_sensitivity: 1.5, ph_opt: 3.8, ph_k: 1.2, aw_ref: 0.970, aw_k: 4.5,
    f_open: 0.40, f_cold_break: 0.60, f_preservatives: 0.70, ph_default: 3.5, aw_default: 0.970,
    theme: { bg: '#D66A00', text: '#FFFFFF', textMuted: '#FFE3C2', accent: '#FF9500' },
    sourceEa: 'https://www.researchgate.net/publication/248513213_Shelflife_prediction_of_fresh_blood_orange_juice'
  },
  fromage: {
    name: { fr: 'Fromage frais', ar: 'جبن طازج', ma: 'فرماج طري' },
    T_ref: 4, RH_ref: 85, DLC_ref: 14, Ea: 13.0,
    rh_sensitivity: 2.2, ph_opt: 5.8, ph_k: 1.5, aw_ref: 0.970, aw_k: 6.0,
    f_open: 0.65, f_cold_break: 0.50, f_preservatives: 0.85, ph_default: 5.5, aw_default: 0.970,
    theme: { bg: '#D4A017', text: '#14241F', textMuted: '#5C4000', accent: '#FFFFFF' },
    sourceEa: 'https://www.sciencedirect.com/science/article/pii/S0022030292780540'
  },
  yaourt: {
    name: { fr: 'Yaourt fermenté', ar: 'زبادي مخمر', ma: 'دانون (ياغورت)' },
    T_ref: 4, RH_ref: 75, DLC_ref: 21, Ea: 67.5,
    rh_sensitivity: 2.0, ph_opt: 4.3, ph_k: 1.4, aw_ref: 0.980, aw_k: 5.0,
    f_open: 0.55, f_cold_break: 0.65, f_preservatives: 0.75, ph_default: 4.3, aw_default: 0.980,
    theme: { bg: '#F5EBEF', text: '#14241F', textMuted: '#6B5C62', accent: '#C46A8B' },
    sourceEa: 'https://www.sciopen.com/article/10.7506/rykxyjs1671-5187-20230914-045'
  },
  conserve: {
    name: { fr: 'Conserve', ar: 'معلبات', ma: 'معلبات' },
    T_ref: 20, RH_ref: 60, DLC_ref: 1095, Ea: 90.0,
    rh_sensitivity: 0.5, ph_opt: 6.5, ph_k: 0.8, aw_ref: 0.950, aw_k: 2.0,
    f_open: 0.04, f_cold_break: 0.98, f_preservatives: 0.90, ph_default: 6.0, aw_default: 0.950,
    theme: { bg: '#2C3539', text: '#FFFFFF', textMuted: '#B0B0B0', accent: '#78909C' },
    sourceEa: 'https://www.academia.edu/53626044/Kinetics_of_Food_Deterioration_and_Shelf_Life_Prediction'
  }
};

const PRODUCT_ICONS = {
  lait_pasteurise: '<svg viewBox="0 0 24 24"><path d="M7 2h10v3l2 3v14H5V8l2-3V2zm2 2v2h6V4H9zm-2 5v11h10V9H7z"/></svg>',
  viande:          '<svg viewBox="0 0 24 24"><path d="M18.8 8.1l-2.9-2.9C15.1 4.4 14.1 4 13 4c-1.1 0-2.1.4-2.9 1.2L5.2 10.1c-1.6 1.6-1.6 4.2 0 5.8l2.9 2.9c.8.8 1.8 1.2 2.9 1.2 1.1 0 2.1-.4 2.9-1.2l4.9-4.9c1.6-1.6 1.6-4.2 0-5.8zM9.5 17.4l-2.9-2.9c-.8-.8-.8-2.1 0-2.9l4.9-4.9c.4-.4.9-.6 1.5-.6s1.1.2 1.5.6l2.9 2.9c.8.8.8 2.1 0 2.9l-4.9 4.9c-.8.8-2.1.8-2.9 0z"/></svg>',
  poisson:         '<svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm4-9h-2v2h2v-2zm-6 0H8v2h2v-2z"/></svg>',
  jus:             '<svg viewBox="0 0 24 24"><path d="M7 2v2h10V2H7zm2 4l-2 16h10l-2-16H9zm2 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>',
  fromage:         '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5c0 .83-.67 1.5-1.5 1.5S7 15.33 7 14.5 7.67 13 8.5 13s1.5.67 1.5 1.5z"/></svg>',
  yaourt:          '<svg viewBox="0 0 24 24"><path d="M6 8l2-6h8l2 6v14H6V8zm2 2v10h8V10H8z"/></svg>',
  conserve:        '<svg viewBox="0 0 24 24"><path d="M4 6v12c0 2.21 3.58 4 8 4s8-1.79 8-4V6c0-2.21-3.58-4-8-4S4 3.79 4 6zm14 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM6 6c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm6 14c-3.31 0-6-1.34-6-3V9c1.66 1.34 4.34 2 6 2s4.34-.66 6-2v8c0 1.66-2.69 3-6 3z"/></svg>'
};

// Constante des gaz parfaits R (kJ/(mol.K))
const R = 0.008314;
let chartInstance = null;

// ============================================================
// 3. INITIALISATION ET GESTIONNAIRES D'ÉVÉNEMENTS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  initLangToggle();
  
  const gallery = document.getElementById('product-gallery');
  const inputProduit = document.getElementById('produit');
  
  for (const [key, p] of Object.entries(PRODUCT_DB)) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.key = key;
    card.innerHTML = `
      <div class="card-icon">${PRODUCT_ICONS[key]}</div>
      <div class="card-name">${p.name[currentLang]}</div>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.product-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      inputProduit.value = key;
      
      // Remplissage des valeurs
      document.getElementById('ph').value = p.ph_default;
      document.getElementById('ph-val-display').textContent = p.ph_default;
      
      document.getElementById('aw').value = p.aw_default.toFixed(3);
      document.getElementById('aw-val-display').textContent = p.aw_default.toFixed(3);
      
      document.getElementById('temperature').value = p.T_ref;

      // Application du THÈME très fort et visible
      document.documentElement.style.setProperty('--bg', p.theme.bg);
      document.documentElement.style.setProperty('--bg-text', p.theme.text);
      document.documentElement.style.setProperty('--bg-text-muted', p.theme.textMuted);
      document.documentElement.style.setProperty('--accent-color', p.theme.accent);
      
      const hex2rgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
      };
      document.documentElement.style.setProperty('--accent-rgb', hex2rgb(p.theme.accent));

      // Génération des icônes d'arrière-plan aléatoires
      generateBackgroundIcons(key);
      
      // Recalculer instantanément
      runCalculation();
    });
    gallery.appendChild(card);
  }

  // Clic initial sur le premier produit pour que tout soit fonctionnel dès le chargement
  setTimeout(() => {
    const firstCard = document.querySelector('.product-card');
    if (firstCard) firstCard.click();
  }, 100);

  // Écouteur Température Manuel
  document.getElementById('temperature').addEventListener('input', runCalculation);

  // Écouteurs Sliders
  const bindSlider = (id, displayId, suffix) => {
    const el = document.getElementById(id);
    const disp = document.getElementById(displayId);
    el.addEventListener('input', () => {
      disp.textContent = el.value + suffix;
      runCalculation();
    });
  };
  bindSlider('humidite', 'rh-val-display', ' %');
  bindSlider('ph', 'ph-val-display', '');
  bindSlider('aw', 'aw-val-display', '');

  // Écouteurs Cartes (Emballage)
  document.querySelectorAll('#emballage-selector .select-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#emballage-selector .select-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      document.getElementById('emballage').value = card.dataset.val;
      runCalculation();
    });
  });

  // Écouteurs Boutons
  const bindButtons = (selectorId, hiddenId) => {
    document.querySelectorAll(`#${selectorId} .select-btn`).forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll(`#${selectorId} .select-btn`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(hiddenId).value = btn.dataset.val;
        runCalculation();
      });
    });
  };
  bindButtons('lumiere-selector', 'lumiere');
  bindButtons('conservateur-selector', 'conservateur_select');

  // Écouteurs Checkboxes
  ['produit_ouvert', 'rupture_froid'].forEach(id => {
    document.getElementById(id).addEventListener('change', runCalculation);
  });

  // Tiroir Réglages
  const advBtn = document.getElementById('adv-toggle-btn');
  const advSettings = document.getElementById('advanced-settings');
  advBtn.addEventListener('click', () => {
    advBtn.classList.toggle('open');
    advSettings.classList.toggle('hidden');
  });

  // Modal Méthodologie
  document.getElementById('open-meth-btn').addEventListener('click', () => {
    document.getElementById('meth-modal').classList.remove('hidden');
  });
  document.getElementById('close-meth-btn').addEventListener('click', () => {
    document.getElementById('meth-modal').classList.add('hidden');
  });

});

// ============================================================
// 4. ANIMATION DES ICÔNES D'ARRIÈRE-PLAN
// ============================================================
function generateBackgroundIcons(key) {
  const container = document.getElementById('bg-icons-container');
  container.innerHTML = ''; // Nettoyage
  const iconSVG = PRODUCT_ICONS[key];
  
  // Créer 15 icônes flottantes
  for(let i = 0; i < 15; i++) {
    const iconDiv = document.createElement('div');
    iconDiv.className = 'bg-icon-float';
    iconDiv.innerHTML = iconSVG;
    
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const size = Math.random() * 40 + 30; // 30px à 70px
    const duration = Math.random() * 20 + 15; // 15s à 35s
    const delay = Math.random() * 5;
    
    iconDiv.style.top = `${top}vh`;
    iconDiv.style.left = `${left}vw`;
    iconDiv.style.width = `${size}px`;
    iconDiv.style.height = `${size}px`;
    iconDiv.style.animationDuration = `${duration}s`;
    iconDiv.style.animationDelay = `${delay}s`;
    
    container.appendChild(iconDiv);
  }
}

// ============================================================
// 5. MOTEUR BILINGUE
// ============================================================
function initLangToggle() {
  const btn = document.getElementById('lang-btn');
  const menu = document.getElementById('lang-menu');
  const icon = document.getElementById('current-lang-icon');
  const text = document.getElementById('current-lang-text');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    menu.classList.add('hidden');
  });

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      currentLang = opt.dataset.lang;
      
      if (currentLang === 'fr') { icon.textContent = '🇫🇷'; text.textContent = 'Français'; }
      else if (currentLang === 'ar') { icon.textContent = '🇸🇦'; text.textContent = 'العربية'; }
      else if (currentLang === 'ma') { icon.textContent = '🇲🇦'; text.textContent = 'الدارجة'; }

      document.getElementById('html-root').setAttribute('dir', currentLang === 'fr' ? 'ltr' : 'rtl');
      
      const dict = i18n[currentLang];
      document.getElementById('t-first-name').textContent = dict.firstName;
      document.getElementById('t-last-name').textContent = dict.lastName;
      if(document.getElementById('t-res-sig')) document.getElementById('t-res-sig').textContent = dict.sig;
      document.getElementById('t-chart-explanation').textContent = dict.chartExplanation;
      document.getElementById('t-header-badge').textContent = dict.badge;
    document.getElementById('t-academic-role').textContent = dict.role;
    document.getElementById('t-academic-school').textContent = dict.school;
    document.getElementById('t-step1-title').textContent = dict.step1;
    document.getElementById('t-step2-title').textContent = dict.step2;
    document.getElementById('t-basic-params').textContent = dict.basicParams;
    document.getElementById('t-temp-label').textContent = dict.temp;
    document.getElementById('t-pack-label').textContent = dict.pack;
    document.getElementById('t-pack-open').textContent = dict.packOpen;
    document.getElementById('t-pack-vac').textContent = dict.packVac;
    document.getElementById('t-pack-map').textContent = dict.packMap;
    document.getElementById('t-preserv-label').textContent = dict.preserv;
    document.getElementById('t-preserv-yes').textContent = dict.yes;
    document.getElementById('t-preserv-no').textContent = dict.no;
    document.getElementById('t-preserv-dk').textContent = dict.dk;
    document.getElementById('t-phys-penalties').textContent = dict.penalties;
    document.getElementById('t-cb-open').textContent = dict.cbOpen;
    document.getElementById('t-cb-cold').textContent = dict.cbCold;
    document.getElementById('t-adv-toggle').childNodes[0].textContent = dict.advToggle;
    document.getElementById('t-rh-label').textContent = dict.rh;
    document.getElementById('t-rh-hint').textContent = dict.rhHint;
    document.getElementById('t-ph-label').textContent = dict.phLabel;
    document.getElementById('t-aw-label').textContent = dict.awLabel;
    document.getElementById('t-aw-hint').textContent = dict.awHint;
    document.getElementById('t-light-label').textContent = dict.light;
    document.getElementById('t-light-low').textContent = dict.lightLow;
    document.getElementById('t-light-high').textContent = dict.lightHigh;
    
    document.getElementById('t-res-sig').textContent = dict.sig;
    document.getElementById('t-res-status-tag').textContent = dict.statusTag;
    document.getElementById('t-hero-label').textContent = dict.heroLabel;
    document.getElementById('res-status-visual-text').textContent = dict.statusGauge;
    document.getElementById('t-factors-title').textContent = dict.factorsTitle;
    document.getElementById('t-math-title').textContent = dict.mathTitle;
    document.getElementById('t-math-intro').textContent = dict.mathIntro;
    document.getElementById('t-chart-title').textContent = dict.chartTitle;
    document.getElementById('t-warning-banner').textContent = dict.warning;
    document.getElementById('t-meth-btn').textContent = dict.methBtn;
    document.getElementById('t-meth-modal-title').textContent = dict.methTitle;

    document.getElementById('t-feedback-title').textContent = dict.feedbackTitle;
    document.getElementById('t-feedback-desc').textContent = dict.feedbackDesc;
    document.getElementById('t-feedback-placeholder').placeholder = dict.feedbackPlaceholder;
    document.getElementById('t-feedback-btn-text').textContent = dict.feedbackBtn;

    document.querySelectorAll('.product-card').forEach(card => {
      const key = card.dataset.key;
      if (key && PRODUCT_DB[key]) {
        card.querySelector('.card-name').textContent = PRODUCT_DB[key].name[currentLang];
      }
    });

    runCalculation();
    });
  });
}

// ============================================================
// 6. MODÉLISATION MATHÉMATIQUE (ARRHENIUS)
// ============================================================
function calcShelfLife(key, T, RH, pH, aw, emballage, lumiere, preserv, isOpen, coldBreak) {
  const p = PRODUCT_DB[key];
  
  // 1. Facteur d'Arrhenius (Thermique)
  const T_ref_K = p.T_ref + 273.15;
  const T_new_K = T + 273.15;
  const fT = Math.exp( (p.Ea / R) * (1/T_ref_K - 1/T_new_K) );
  
  // 2. Facteur d'Humidité relative
  let fRH = 1.0;
  if (emballage === 'non_emballe' || isOpen) {
    // Fort impact de l'humidité si le produit est exposé
    fRH = Math.max(0.2, Math.min(5.0, Math.pow(Math.max(5, RH) / Math.max(1, p.RH_ref), p.rh_sensitivity)));
  }
  
  // 3. Facteur pH
  const dPH = Math.abs(pH - p.ph_opt);
  // Un pH éloigné ralentit la croissance, donc fPH < 1 (allonge la durée de vie)
  const fPH_val = Math.max(0.1, 1 / (1 + p.ph_k * dPH));
  
  // 4. Facteur aw
  const dAW = aw - p.aw_ref;
  const fAW = Math.max(0.05, Math.min(10.0, Math.exp(p.aw_k * dAW)));

  // 5. Emballage
  let f_emb = 1.0;
  if (emballage === 'sous_vide' && !isOpen) f_emb = 2.5;
  else if (emballage === 'map' && !isOpen) f_emb = 3.5;

  // 6. Lumière
  let f_lum = 1.0;
  if (lumiere === 'forte') f_lum = 1.15; 

  // 7. Conservateurs
  let f_pres = 1.0;
  if (preserv === 'oui') f_pres = p.f_preservatives;

  // Taux d'accélération brut (AF)
  let AF = fT * fRH * fPH_val * fAW * f_lum * f_pres;
  
  // Durée de vie projetée
  let DLC_est = (p.DLC_ref * f_emb) / AF;
  
  // Pénalités
  if (isOpen) DLC_est *= p.f_open;
  if (coldBreak) DLC_est *= p.f_cold_break;

  // Limites
  DLC_est = Math.max(0.1, Math.min(p.DLC_ref * 25, DLC_est));
  
  return { p, fT, fRH, fPH: fPH_val, fAW, f_emb, f_lum, f_pres, AF, DLC_est };
}

// ============================================================
// 7. RENDU ET MISE À JOUR VISUELLE
// ============================================================
function runCalculation() {
  const key = document.getElementById('produit').value;
  if (!key) return; // Aucun produit sélectionné

  const panel = document.getElementById('results-panel');
  panel.classList.remove('hidden');

  const T = parseFloat(document.getElementById('temperature').value);
  const RH = parseFloat(document.getElementById('humidite').value);
  const pH = parseFloat(document.getElementById('ph').value);
  const aw = parseFloat(document.getElementById('aw').value);
  
  const emballage = document.getElementById('emballage').value;
  const lumiere = document.getElementById('lumiere').value;
  const preserv_val = document.getElementById('conservateur_select').value;
  
  const isOpen = document.getElementById('produit_ouvert').checked;
  const coldBreak = document.getElementById('rupture_froid').checked;

  const res = calcShelfLife(key, T, RH, pH, aw, emballage, lumiere, preserv_val, isOpen, coldBreak);

  document.getElementById('res-product-title').textContent = res.p.name[currentLang];

  // Calcul Fourchette (± 15%)
  const minDays = Math.max(0, res.DLC_est * 0.85);
  const maxDays = res.DLC_est * 1.15;
  
  const rangeEl = document.getElementById('res-range');

  const formatTime = (decimalDays, lang) => {
    const fullDays = Math.floor(decimalDays);
    const remainingHours = Math.round((decimalDays - fullDays) * 24);
    let d = fullDays;
    let h = remainingHours;
    if (h === 24) { d += 1; h = 0; }

    if (lang === 'fr') {
      let parts = [];
      if (d > 0) parts.push(`${d} jour${d > 1 ? 's' : ''}`);
      if (h > 0) parts.push(`${h} heure${h > 1 ? 's' : ''}`);
      return parts.join(' et ');
    } else if (lang === 'ar') {
      let dPart = '';
      if (d === 1) dPart = 'يوم واحد';
      else if (d === 2) dPart = 'يومان';
      else if (d >= 3 && d <= 10) dPart = `${d} أيام`;
      else if (d > 10) dPart = `${d} يوماً`;

      let hPart = '';
      if (h === 1) hPart = 'ساعة واحدة';
      else if (h === 2) hPart = 'ساعتان';
      else if (h >= 3 && h <= 10) hPart = `${h} ساعات`;
      else if (h > 10) hPart = `${h} ساعة`;

      if (d === 0) return hPart || 'منتهي';
      if (h === 0) return dPart;
      return `${dPart} و ${hPart}`;
    } else if (lang === 'ma') {
      let dPart = '';
      if (d === 1) dPart = 'نهار واحد';
      else if (d === 2) dPart = 'يومين';
      else if (d >= 3 && d <= 10) dPart = `${d} يام`;
      else if (d > 10) dPart = `${d} يوم`;

      let hPart = '';
      if (h === 1) hPart = 'ساعة';
      else if (h === 2) hPart = 'ساعتين';
      else if (h >= 3 && h <= 10) hPart = `${h} سوايع`;
      else if (h > 10) hPart = `${h} ساعة`;

      if (d === 0) return hPart || 'خاسر';
      if (h === 0) return dPart;
      return `${dPart} و ${hPart}`;
    }
  };

  if (res.DLC_est < 0.04) { // Moins d'une heure
    rangeEl.textContent = i18n[currentLang].expired;
  } else {
    const minStr = formatTime(minDays, currentLang);
    const maxStr = formatTime(maxDays, currentLang);
    
    if (minStr === maxStr) {
      rangeEl.innerHTML = minStr;
    } else {
      const fromLbl = currentLang === 'fr' ? 'De' : 'من';
      const toLbl = currentLang === 'fr' ? 'à' : 'إلى';
      rangeEl.innerHTML = `<span style="font-size: 0.6em; opacity: 0.8; font-family: var(--font-body);">${fromLbl}</span> ${minStr} <br><span style="font-size: 0.6em; opacity: 0.8; font-family: var(--font-body);">${toLbl}</span> ${maxStr}`;
    }
  }
  
  // Animation subtile du texte pour prouver la mise à jour
  rangeEl.style.transform = 'scale(1.05)';
  setTimeout(() => rangeEl.style.transform = 'scale(1)', 200);

  // Jauge Fraîcheur
  const rawIndex = Math.max(0, Math.min(100, (1 / res.AF) * 100 * (res.f_emb)));
  const progressCircle = document.getElementById('progress-ring-circle');
  const pctText = document.getElementById('res-status-pct');
  
  pctText.textContent = rawIndex.toFixed(0) + '%';
  
  const radius = progressCircle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = circumference - (rawIndex / 100) * circumference;

  renderFactors(res, key, T, RH, pH, aw, emballage, lumiere, preserv_val, isOpen, coldBreak);
  renderMath(res, T, RH, pH, aw);
  drawChart(minDays, maxDays);
}

function renderFactors(res, key, T, RH, pH, aw, emballage, lumiere, preserv_val, isOpen, coldBreak) {
  let html = ``;
  const t = (f, a, m) => currentLang === 'fr' ? f : (currentLang === 'ma' ? (m || a) : a);
  const addFactor = (title, why, sourceUrl = null, sourceText = null) => { 
    let sourceHtml = sourceUrl ? `<br><a href="${sourceUrl}" target="_blank" class="factor-source-link">${sourceText}</a>` : '';
    html += `<div class="factor-item"><span class="factor-title">${title}</span><p class="factor-explanation">${why}${sourceHtml}</p></div>`; 
  };

  addFactor(
    t(`Température : ${T}°C`, `درجة الحرارة : ${T}°C`, `الحرارة : ${T}°C`), 
    t(
      `L'équation d'Arrhenius modélise l'énergie des molécules. À ${T}°C, l'évolution est ${res.fT > 1 ? 'accélérée' : 'ralentie'}.`, 
      `عند ${T} درجة، يكون التلف ${res.fT > 1 ? 'سريعا' : 'بطيئا'}.`,
      `فدرجة ${T}، التلف كيكون ${res.fT > 1 ? 'سريع' : 'بطيء'}.`
    ),
    res.p.sourceEa,
    t(`Source (Ea = ${res.p.Ea} kJ/mol)`, `المصدر العلمي`, `المصدر العلمي`)
  );
  
  if (emballage === 'non_emballe' || isOpen) {
    addFactor(
      t(`Humidité Ambiante : ${RH}%`, `الرطوبة المحيطة : ${RH}%`, `الرطوبة دالجو : ${RH}%`), 
      t(`Le produit n'étant pas scellé, l'humidité ambiante modifie le taux de dégradation d'un facteur de ×${res.fRH.toFixed(2)}.`, 
        `بما أن المنتج غير مغلق، فالرطوبة تؤثر بعامل ×${res.fRH.toFixed(2)}.`,
        `حيت المنتوج محلول، الرطوبة كتأثر ب ×${res.fRH.toFixed(2)}.`
      )
    );
  }
  
  addFactor(
    t(`Activité de l'eau : ${aw}`, `النشاط المائي : ${aw}`, `كمية الما (aw) : ${aw}`), 
    t(`Une aw de ${aw} influence la disponibilité en eau. Modificateur: ×${res.fAW.toFixed(2)}.`, 
      `نشاط مائي ب ${aw} يؤثر على توفر الماء. معامل: ×${res.fAW.toFixed(2)}`,
      `نسبة الما ${aw} كتخلي البكتيريا تكبر. التأثير: ×${res.fAW.toFixed(2)}`
    ),
    "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-technical-guides/water-activity-aw-foods",
    t(`Source FDA (aw)`, `مصدر FDA`, `مصدر من FDA`)
  );
  
  addFactor(
    t(`Potentiel Hydrogène : pH ${pH}`, `الرقم الهيدروجيني : pH ${pH}`, `الحموضة : pH ${pH}`), 
    t(`L'écart avec l'optimum (${res.p.ph_opt}) stresse la matrice. Modificateur: ×${res.fPH.toFixed(2)}.`, 
      `الرقم الهيدروجيني يؤثر بمعامل: ×${res.fPH.toFixed(2)}`,
      `الحموضة كتأثر ب : ×${res.fPH.toFixed(2)}`
    ),
    "https://www.fda.gov/food/guidance-documents-regulatory-information-topic-food-and-dietary-supplements/acidified-low-acid-canned-foods-guidance-documents-regulatory-information",
    t(`Source FDA (pH)`, `مصدر FDA`, `مصدر من FDA`)
  );

  if (emballage !== 'non_emballe' && !isOpen) {
    addFactor(
      t(`Emballage protecteur`, `تغليف واقي`, `التغليف`), 
      t(`L'absence d'oxygène retarde l'altération (Facteur ×${res.f_emb}).`, 
        `غياب الأكسجين يؤخر التلف (عامل ×${res.f_emb}).`,
        `ماكاينش الأكسجين، هادشي كيعطل الخسورية (×${res.f_emb}).`
      ),
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC92181/",
      t(`Source Sivertsvik et al.`, `المصدر`, `المصدر العلمي`)
    );
  }

  if (preserv_val === 'ne_sais_pas') {
    addFactor(
      t(`Conservateurs : Précaution`, `مواد حافظة : مبدأ الحيطة`, `مواد حافظة : احتياط`), 
      t(`En cas d'incertitude, le modèle applique le scénario critique (Facteur ×1.0).`, 
        `في حالة عدم اليقين، يطبق النموذج السيناريو الحرج.`,
        `حيت ماعرفناش واش كاينين مواد حافظة، الموديل كيحسب على أساس ماكاينينش.`
      )
    );
  } else if (preserv_val === 'oui') {
    addFactor(
      t(`Conservateurs : Actifs`, `مواد حافظة : نشطة`, `مواد حافظة : كاينين`), 
      t(`Inhibe les fonctions cellulaires (Facteur ×${res.f_pres}).`, 
        `يمنع وظائف الخلية (عامل ×${res.f_pres}).`,
        `كتعطل البكتيريا باش ماتكبرش (×${res.f_pres}).`
      )
    );
  }
  document.getElementById('factors-list').innerHTML = html;
}

function renderMath(res, T, RH, pH, aw) {
  const t = (f, a, m) => currentLang === 'fr' ? f : (currentLang === 'ma' ? (m || a) : a);
  const T_ref_K = (res.p.T_ref + 273.15).toFixed(2);
  const T_new_K = (T + 273.15).toFixed(2);

  document.getElementById('calc-steps').innerHTML = `
    <div class="calc-step-row">
      <span class="calc-step-num">01</span>
      <div class="calc-step-content">
        <span class="calc-step-title">${t('Thermodynamique (Arrhenius)', 'الديناميكا الحرارية (أرينيوس)', 'الديناميكا الحرارية (أرينيوس)')}</span>
        <div class="calc-step-formula" dir="ltr">
          <i>k<sub>new</sub> / k<sub>ref</sub></i> = <i>e</i><sup> (E<sub>a</sub> / R) × (1/T<sub>ref</sub> - 1/T<sub>new</sub>) </sup><br><br>
          = <i>e</i><sup> (${res.p.Ea} / 0.008314) × (1/${T_ref_K} - 1/${T_new_K}) </sup><br><br>
          = <b>${res.fT.toFixed(3)}</b>
        </div>
        <div class="math-params-explanation">
          <ul>
            <li><b>E<sub>a</sub> (${res.p.Ea} kJ/mol)</b> : ${t("Énergie d'activation (Sensibilité thermique du produit).", "طاقة التنشيط (الحساسية الحرارية الخاصة بالمنتج).", "طاقة التنشيط (شحال المنتوج حساس للحرارة).")} <a href="${res.p.sourceEa}" target="_blank" class="factor-source-link">${t("Lien Source", "رابط المصدر", "رابط المصدر")}</a></li>
            <li><b>R (0.008314)</b> : ${t("Constante universelle des gaz parfaits.", "ثابت الغازات العام (ثابت فيزيائي).", "ثابت الغازات العام (ثابت فيزيائي).")}</li>
            <li><b>T<sub>ref</sub> / T<sub>new</sub></b> : ${t("Température de référence vs Température actuelle (en Kelvin).", "درجة الحرارة المرجعية وحرارة التخزين (بالكلفن).", "الحرارة المرجعية مقارنة مع حرارة التخزين دابا (بالكلفن).")}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="calc-step-row">
      <span class="calc-step-num">02</span>
      <div class="calc-step-content">
        <span class="calc-step-title">${t('Multifacteurs Physico-Chimiques', 'عوامل فيزيائية وكيميائية متعددة', 'عوامل فيزيائية وكيميائية')}</span>
        <div class="calc-step-formula">
          f_aw = exp[k * (aw_new - aw_ref)] = ${res.fAW.toFixed(3)}<br>
          f_pH = ${res.fPH.toFixed(3)}<br>
          f_RH = ${res.fRH.toFixed(3)}
        </div>
      </div>
    </div>
  `;
}

function drawChart(minDays, maxDays) {
  const ctx = document.getElementById('freshnessChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  const labels = [0, (minDays/2).toFixed(1), minDays.toFixed(1), maxDays.toFixed(1)];
  const data = [100, 50, 5, 0];
  const color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: data, 
        borderColor: color, 
        backgroundColor: color.replace(')', ', 0.1)').replace('rgb', 'rgba'),
        borderWidth: 3, fill: true, tension: 0.3
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      animation: { duration: 400 },
      scales: {
        x: { 
          title: { display: true, text: currentLang === 'fr' ? 'Jours de conservation' : (currentLang === 'ma' ? 'يام دالحفظ' : 'أيام الحفظ'), color: '#9CA3AF' },
          grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9CA3AF' } 
        },
        y: { 
          min: 0, max: 100, 
          title: { display: true, text: currentLang === 'fr' ? 'Indice Fraîcheur (%)' : (currentLang === 'ma' ? 'مؤشر النضارة (%)' : 'مؤشر النضارة (%)'), color: '#9CA3AF' },
          grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9CA3AF' }
        }
      }
    }
  });
}

// src/utils/i18nColors.js
// A comprehensive (dictionary-first) color translator for EN ⇄ (FR, AR)
// Usage:
//   translateColorName("jaune", "ar")           -> "أصفر"
//   translateColorName("Bleu marine", "fr")     -> "Bleu marine"
//   translateColorName("light grey", "ar")      -> "فاتح رمادي"
//   translateColorName("برتقالي محروق", "fr")   -> "Orange brûlé"
// Fallback: returns "" if we can't confidently translate; you can then display the raw value.

// ---------- helpers ----------
const stripKey = (s) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD") // remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ");

// ---------- modifiers ----------
export const MODIFIERS = {
  light:  { fr: "Clair",  ar: "فاتح" },
  dark:   { fr: "Foncé",  ar: "داكن" },
  matte:  { fr: "Mat",    ar: "مطفي" },
  glossy: { fr: "Brillant", ar: "لامع" },
};

// Map FR/AR (and some EN synonyms) → EN modifier key
const MODIFIER_MAP_ANY_TO_EN = {
  // EN
  "light": "light",
  "dark": "dark",
  "matte": "matte",
  "matt": "matte",
  "glossy": "glossy",
  "gloss": "glossy",
  // FR
  "clair": "light",
  "fonce": "dark",
  "mat": "matte",
  "brillant": "glossy",
  // AR
  "فاتح": "light",
  "داكن": "dark",
  "مطفي": "matte",
  "لامع": "glossy",
};

// ---------- core color dictionary (EN base -> { fr, ar }) ----------
export const BASE_COLORS = {
  // Neutrals / whites / blacks
  "white":        { fr: "Blanc",          ar: "أبيض" },
  "off-white":    { fr: "Blanc cassé",    ar: "أوف وايت" },
  "ivory":        { fr: "Ivoire",         ar: "عاجي" },
  "ecru":         { fr: "Écru",           ar: "عاجي" },
  "cream":        { fr: "Crème",          ar: "كريمي" },
  "cream-white":  { fr: "Blanc crème",    ar: "أبيض كريمي" },
  "beige":        { fr: "Beige",          ar: "بيج" },
  "sand":         { fr: "Sable",          ar: "رملي" },
  "tan":          { fr: "Tan",            ar: "تان" },
  "camel":        { fr: "Camel",          ar: "جملي" },
  "taupe":        { fr: "Taupe",          ar: "رمادي بني" },
  "grey":         { fr: "Gris",           ar: "رمادي" },
  "light-grey":   { fr: "Gris clair",     ar: "رمادي فاتح" },
  "dark-grey":    { fr: "Gris foncé",     ar: "رمادي داكن" },
  "charcoal":     { fr: "Anthracite",     ar: "فحمي" },
  "graphite":     { fr: "Graphite",       ar: "رمادي غرافيت" },
  "smoke":        { fr: "Fumé",           ar: "مدخن" },
  "black":        { fr: "Noir",           ar: "أسود" },
  "off-black":    { fr: "Noir adouci",    ar: "أسود مخفف" },
  "transparent":  { fr: "Transparent",    ar: "شفاف" },
  "clear":        { fr: "Transparent",    ar: "شفاف" },
  "crystal":      { fr: "Cristal",        ar: "كريستالي" },

  // Browns
  "brown":        { fr: "Marron",         ar: "بني" },
  "chocolate":    { fr: "Chocolat",       ar: "شوكولاتة" },
  "coffee":       { fr: "Café",           ar: "قهوة" },
  "walnut":       { fr: "Noyer",          ar: "جوزي" },
  "caramel":      { fr: "Caramel",        ar: "كراميل" },
  "cognac":       { fr: "Cognac",         ar: "كونياك" },
  "mahogany":     { fr: "Acajou",         ar: "ماهوجني" },
  "chestnut":     { fr: "Châtaigne",      ar: "كستنائي" },

  // Yellows / golds / oranges
  "yellow":       { fr: "Jaune",          ar: "أصفر" },
  "mustard":      { fr: "Moutarde",       ar: "خردلي" },
  "gold":         { fr: "Doré",           ar: "ذهبي" },
  "honey":        { fr: "Miel",           ar: "عسلي" },
  "lemon":        { fr: "Citron",         ar: "ليموني" },
  "champagne":    { fr: "Champagne",      ar: "شمبانيا" },
  "amber":        { fr: "Ambre",          ar: "كهرماني" },
  "orange":       { fr: "Orange",         ar: "برتقالي" },
  "burnt-orange": { fr: "Orange brûlé",   ar: "برتقالي محروق" },
  "terracotta":   { fr: "Terracotta",     ar: "طوبي" },
  "coral":        { fr: "Corail",         ar: "مرجاني" },
  "apricot":      { fr: "Abricot",        ar: "مشمشي" },
  "peach":        { fr: "Pêche",          ar: "خوخي" },
  "salmon":       { fr: "Saumon",         ar: "سالمون" },

  // Reds & Pinks
  "red":          { fr: "Rouge",          ar: "أحمر" },
  "crimson":      { fr: "Cramoisi",       ar: "قرمزي" },
  "scarlet":      { fr: "Écarlate",       ar: "قرمزي فاقع" },
  "burgundy":     { fr: "Bordeaux",       ar: "خمري" },
  "maroon":       { fr: "Marron foncé",   ar: "عنابي" },
  "wine":         { fr: "Vin",            ar: "خمري" },
  "ruby":         { fr: "Rubis",          ar: "ياقوتي" },
  "pink":         { fr: "Rose",           ar: "وردي" },
  "blush":        { fr: "Rose pâle",      ar: "وردي فاتح" },
  "hot-pink":     { fr: "Rose vif",       ar: "وردي فاقع" },
  "fuchsia":      { fr: "Fuchsia",        ar: "فوشيا" },
  "magenta":      { fr: "Magenta",        ar: "ماجنتا" },

  // Greens
  "green":        { fr: "Vert",           ar: "أخضر" },
  "mint":         { fr: "Menthe",         ar: "نعناعي" },
  "sage":         { fr: "Sauge",          ar: "مريمي" },
  "emerald":      { fr: "Émeraude",       ar: "زمردي" },
  "forest":       { fr: "Vert forêt",     ar: "أخضر غامق" },
  "olive":        { fr: "Olive",          ar: "زيتي" },
  "khaki":        { fr: "Kaki",           ar: "كاكي" },
  "lime":         { fr: "Citron vert",    ar: "أخضر فاقع" },
  "pistachio":    { fr: "Pistache",       ar: "فستقي" },
  "seafoam":      { fr: "Vert d’eau",     ar: "أخضر مائي" },
  "moss":         { fr: "Mousse",         ar: "طحلبي" },

  // Blues / teals
  "blue":         { fr: "Bleu",           ar: "أزرق" },
  "navy":         { fr: "Bleu marine",    ar: "كحلي" },
  "royal-blue":   { fr: "Bleu roi",       ar: "أزرق ملكي" },
  "sky-blue":     { fr: "Bleu ciel",      ar: "أزرق سماوي" },
  "baby-blue":    { fr: "Bleu bébé",      ar: "أزرق فاتح" },
  "azure":        { fr: "Azur",           ar: "لازوردي" },
  "indigo":       { fr: "Indigo",         ar: "نيلي" },
  "cobalt":       { fr: "Cobalt",         ar: "كوبالت" },
  "cyan":         { fr: "Cyan",           ar: "سماوي" },
  "turquoise":    { fr: "Turquoise",      ar: "فيروزي" },
  "teal":         { fr: "Sarcelle",       ar: "أزرق مخضر" },

  // Purples
  "purple":       { fr: "Violet",         ar: "أرجواني" },
  "lavender":     { fr: "Lavande",        ar: "لافندر" },
  "lilac":        { fr: "Lilas",          ar: "أرجواني فاتح" },
  "plum":         { fr: "Prune",          ar: "برقوقي" },
  "eggplant":     { fr: "Aubergine",      ar: "باذنجاني" },
  "mauve":        { fr: "Mauve",          ar: "موف" },

  // Metals / finishes / patterns
  "silver":       { fr: "Argenté",        ar: "فضي" },
  "bronze":       { fr: "Bronze",         ar: "برونزي" },
  "copper":       { fr: "Cuivré",         ar: "نحاسي" },
  "pewter":       { fr: "Étain",          ar: "قصديري" },
  "gunmetal":     { fr: "Canon de fusil", ar: "رمادي معدني غامق" },
  "rose-gold":    { fr: "Or rose",        ar: "ذهبي وردي" },
  "chrome":       { fr: "Chromé",         ar: "مطلي بالكروم" },
  "titanium":     { fr: "Titane",         ar: "تيتانيوم" },
  "tortoise":     { fr: "Écaille",        ar: "صدفي" },
  "horn":         { fr: "Corne",          ar: "قرني" },
  "multicolor":   { fr: "Multicolore",    ar: "متعدد الألوان" },
};

// ---------- aliases & normalization (FR/AR/EN → EN base key) ----------
const EN_ALIASES = {
  "gray": "grey",
  "navy blue": "navy",
  "royal blue": "royal-blue",
  "sky blue": "sky-blue",
  "baby blue": "baby-blue",
  "rose gold": "rose-gold",
  "gun metal": "gunmetal",
  "off white": "off-white",
  "off black": "off-black",
  "tortoiseshell": "tortoise",
};

const ANY_TO_EN = {
  // FR → EN base
  "blanc": "white",
  "blanc casse": "off-white",
  "ivoire": "ivory",
  "ecru": "ecru",
  "creme": "cream",
  "beige": "beige",
  "sable": "sand",
  "tan": "tan",
  "camel": "camel",
  "taupe": "taupe",
  "gris": "grey",
  "gris clair": "light-grey",
  "gris fonce": "dark-grey",
  "anthracite": "charcoal",
  "graphite": "graphite",
  "fume": "smoke",
  "noir": "black",
  "transparent": "transparent",
  "cristal": "crystal",
  "marron": "brown",
  "brun": "brown",
  "chocolat": "chocolate",
  "cafe": "coffee",
  "noyer": "walnut",
  "caramel": "caramel",
  "cognac": "cognac",
  "acajou": "mahogany",
  "chataigne": "chestnut",
  "jaune": "yellow",
  "moutarde": "mustard",
  "dore": "gold",
  "or": "gold",
  "miel": "honey",
  "citron": "lemon",
  "champagne": "champagne",
  "ambre": "amber",
  "orange": "orange",
  "orange brule": "burnt-orange",
  "terracotta": "terracotta",
  "corail": "coral",
  "abricot": "apricot",
  "peche": "peach",
  "saumon": "salmon",
  "rouge": "red",
  "cramoisi": "crimson",
  "ecarlate": "scarlet",
  "bordeaux": "burgundy",
  "prune": "plum",
  "grenat": "maroon",
  "vin": "wine",
  "rubis": "ruby",
  "rose": "pink",
  "rose pale": "blush",
  "rose vif": "hot-pink",
  "fuchsia": "fuchsia",
  "magenta": "magenta",
  "vert": "green",
  "menthe": "mint",
  "sauge": "sage",
  "emeraude": "emerald",
  "vert foret": "forest",
  "olive": "olive",
  "kaki": "khaki",
  "citron vert": "lime",
  "pistache": "pistachio",
  "vert deau": "seafoam",
  "mousse": "moss",
  "bleu": "blue",
  "bleu marine": "navy",
  "bleu roi": "royal-blue",
  "bleu ciel": "sky-blue",
  "bleu bebe": "baby-blue",
  "azur": "azure",
  "indigo": "indigo",
  "cobalt": "cobalt",
  "cyan": "cyan",
  "turquoise": "turquoise",
  "sarcelle": "teal",
  "violet": "purple",
  "lavande": "lavender",
  "lilas": "lilac",
  "aubergine": "eggplant",
  "mauve": "mauve",
  "argente": "silver",
  "bronze": "bronze",
  "cuivre": "copper",
  "etain": "pewter",
  "canon de fusil": "gunmetal",
  "or rose": "rose-gold",
  "chrome": "chrome",
  "titane": "titanium",
  "ecaille": "tortoise",
  "corne": "horn",
  "multicolore": "multicolor",

  // AR → EN base
  "ابيض": "white",
  "اوف وايت": "off-white",
  "عاجي": "ivory",
  "كريمي": "cream",
  "بيج": "beige",
  "رملي": "sand",
  "تان": "tan",
  "جملي": "camel",
  "رمادي بني": "taupe",
  "رمادي": "grey",
  "رمادي فاتح": "light-grey",
  "رمادي داكن": "dark-grey",
  "فحمي": "charcoal",
  "رمادي غرافيت": "graphite",
  "مدخن": "smoke",
  "اسود": "black",
  "شفاف": "transparent",
  "كريستالي": "crystal",
  "بني": "brown",
  "شوكولاتة": "chocolate",
  "قهوة": "coffee",
  "جوزي": "walnut",
  "كراميل": "caramel",
  "كونياك": "cognac",
  "ماهوجني": "mahogany",
  "كستنائي": "chestnut",
  "اصفر": "yellow",
  "خردلي": "mustard",
  "ذهبي": "gold",
  "عسلي": "honey",
  "ليموني": "lemon",
  "شمبانيا": "champagne",
  "كهرماني": "amber",
  "برتقالي": "orange",
  "برتقالي محروق": "burnt-orange",
  "طوبي": "terracotta",
  "مرجاني": "coral",
  "مشمشي": "apricot",
  "خوخي": "peach",
  "سالمون": "salmon",
  "احمر": "red",
  "قرمزي": "crimson",
  "قرمزي فاقع": "scarlet",
  "خمري": "burgundy",
  "عنابي": "maroon",
  "ياقوتي": "ruby",
  "وردي": "pink",
  "وردي فاتح": "blush",
  "وردي فاقع": "hot-pink",
  "فوشيا": "fuchsia",
  "ماجنتا": "magenta",
  "اخضر": "green",
  "نعناعي": "mint",
  "مريمي": "sage",
  "زمردي": "emerald",
  "اخضر غامق": "forest",
  "زيتي": "olive",
  "كاكي": "khaki",
  "اخضر فاقع": "lime",
  "فستقي": "pistachio",
  "اخضر مائي": "seafoam",
  "طحلبي": "moss",
  "ازرق": "blue",
  "كحلي": "navy",
  "ازرق ملكي": "royal-blue",
  "ازرق سماوي": "sky-blue",
  "ازرق فاتح": "baby-blue",
  "لازوردي": "azure",
  "نيلي": "indigo",
  "كوبالت": "cobalt",
  "سماوي": "cyan",
  "فيروزي": "turquoise",
  "ازرق مخضر": "teal",
  "ارجواني": "purple",
  "لافندر": "lavender",
  "ارجواني فاتح": "lilac",
  "باذنجاني": "eggplant",
  "موف": "mauve",
  "فضي": "silver",
  "برونزي": "bronze",
  "نحاسي": "copper",
  "قصديري": "pewter",
  "رمادي معدني غامق": "gunmetal",
  "ذهبي وردي": "rose-gold",
  "مطلي بالكروم": "chrome",
  "تيتانيوم": "titanium",
  "صدفي": "tortoise",
  "قرني": "horn",
  "متعدد الالوان": "multicolor",
};

// ---------- parsing & translation ----------
function normalizeToEN(raw) {
  // try full-phrase match first
  const phrase = stripKey(raw);
  if (!phrase) return { base: "", mods: [] };

  // direct phrase → EN base
  if (ANY_TO_EN[phrase]) return { base: ANY_TO_EN[phrase], mods: [] };
  if (EN_ALIASES[phrase]) return { base: EN_ALIASES[phrase], mods: [] };

  // token-level pass (modifiers + leftover for base)
  const tokens = phrase.split(" ");
  const mods = [];
  const leftovers = [];
  for (const t of tokens) {
    const m = MODIFIER_MAP_ANY_TO_EN[t];
    if (m) mods.push(m);
    else leftovers.push(t);
  }

  const leftoverPhrase = leftovers.join(" ").trim();

  // leftover phrase may map directly (e.g., "bleu marine")
  if (ANY_TO_EN[leftoverPhrase]) return { base: ANY_TO_EN[leftoverPhrase], mods };
  if (EN_ALIASES[leftoverPhrase]) return { base: EN_ALIASES[leftoverPhrase], mods };

  // try last token as base (e.g., "royal blue", "navy blue")
  if (leftovers.length > 1) {
    const last = leftovers[leftovers.length - 1];
    if (ANY_TO_EN[last]) return { base: ANY_TO_EN[last], mods };
    if (EN_ALIASES[last]) return { base: EN_ALIASES[last], mods };
    if (BASE_COLORS[last]) return { base: last, mods };
  }

  // final attempt: if the whole leftover exists in BASE_COLORS
  if (BASE_COLORS[leftoverPhrase]) return { base: leftoverPhrase, mods };

  // unknown
  return { base: "", mods };
}

// Convert an input color label (can be EN/FR/AR, with/without modifiers) to a translated label
export function translateColorName(input, to = "fr") {
  // If consumer passes an object {en,fr,ar}, prefer that directly
  if (input && typeof input === "object") {
    const pack = input;
    if (to === "fr") return pack.fr || pack.en || "";
    if (to === "ar") return pack.ar || pack.en || "";
    return pack.en || pack.fr || pack.ar || "";
  }

  const { base, mods } = normalizeToEN(input);
  if (!base) return ""; // unknown -> let caller fallback to raw

  const baseT = BASE_COLORS[base]?.[to] || base;
  if (!mods.length) return baseT;

  const modsT = mods.map((m) => MODIFIERS[m]?.[to] || m);
  return `${modsT.join(" ")} ${baseT}`.trim();
}

// Optional helper: get a full pack {en, fr, ar} from any input
export function translateColorPack(input) {
  const { base, mods } = normalizeToEN(input);
  if (!base) {
    const raw = String(input || "");
    return { en: raw, fr: raw, ar: raw };
  }
  const mk = (to) => {
    const baseT = BASE_COLORS[base]?.[to] || base;
    if (!mods.length) return baseT;
    const modsT = mods.map((m) => MODIFIERS[m]?.[to] || m).join(" ");
    return `${modsT} ${baseT}`.trim();
  };
  return { en: mk("en"), fr: mk("fr"), ar: mk("ar") };
}

export default translateColorName;

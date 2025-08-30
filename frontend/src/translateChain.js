// src/utils/translateChain.js
const translate = require("translate-google"); // keep as a fallback
const LRU = new Map(); // super tiny in-memory cache

async function apiTranslate(text, to) {
  const key = `${to}::${text}`;
  if (LRU.has(key)) return LRU.get(key);
  try {
    const t = await translate(text, { to });
    LRU.set(key, t);
    if (LRU.size > 500) { // simple cap
      LRU.delete(LRU.keys().next().value);
    }
    return t;
  } catch {
    return text; // last fallback
  }
}

/**
 * If `given` exists (human override), use it.
 * Else if `dictFn` returns a non-empty string, use it.
 * Else call API translator.
 */
async function translateSmart({ en, givenFR, givenAR, dictFn }) {
  const fr = givenFR || (dictFn ? dictFn("fr") : "") || await apiTranslate(en, "fr");
  const ar = givenAR || (dictFn ? dictFn("ar") : "") || await apiTranslate(en, "ar");
  return { en, fr, ar };
}

module.exports = { translateSmart };

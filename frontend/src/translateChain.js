// ==========================================
// Utility: Smart Translation Chain
// File: src/utils/translateChain.js
// ==========================================

/**
 * Uses `translate-google` as a fallback translator.
 * Provides:
 *   - Tiny in-memory LRU cache (Map-based)
 *   - Smart translation resolution (human overrides, dictFn, API fallback)
 */

const translate = require("translate-google"); // fallback translator
const LRU = new Map(); // super lightweight cache

// ------------------------------------------
// Internal: API Translator with Cache
// ------------------------------------------
async function apiTranslate(text, to) {
  const key = `${to}::${text}`;

  // ✅ If cached, return immediately
  if (LRU.has(key)) return LRU.get(key);

  try {
    // Attempt Google Translate API call
    const t = await translate(text, { to });

    // Cache result
    LRU.set(key, t);

    // Keep cache under 500 entries (FIFO eviction)
    if (LRU.size > 500) {
      LRU.delete(LRU.keys().next().value);
    }

    return t;
  } catch {
    // ❌ If API fails, return original text
    return text;
  }
}

// ------------------------------------------
// Public: Smart Translation Function
// ------------------------------------------
/**
 * Smart translation chain:
 *   1. If `given` override exists, use it.
 *   2. Else if `dictFn` provides a non-empty string, use it.
 *   3. Else fallback to API translation.
 *
 * @param {Object} options
 * @param {string} options.en       - English source string (required)
 * @param {string} [options.givenFR] - Human-provided French override
 * @param {string} [options.givenAR] - Human-provided Arabic override
 * @param {Function} [options.dictFn] - Optional dictionary lookup (lang → string)
 *
 * @returns {Promise<{en:string, fr:string, ar:string}>}
 */
async function translateSmart({ en, givenFR, givenAR, dictFn }) {
  const fr =
    givenFR || (dictFn ? dictFn("fr") : "") || (await apiTranslate(en, "fr"));

  const ar =
    givenAR || (dictFn ? dictFn("ar") : "") || (await apiTranslate(en, "ar"));

  return { en, fr, ar };
}

// ------------------------------------------
// Exports
// ------------------------------------------
module.exports = { translateSmart };

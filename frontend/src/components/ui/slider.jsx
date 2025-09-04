// src/components/ui/slider.jsx
import * as React from "react";

/**
 * 🎚️ Slider
 * ---------------------------
 * A simple dual-range slider (min + max) with controlled state.
 *
 * Props:
 * - value (array [min, max]) → initial values for both sliders.
 * - onValueChange (function) → callback fired with new [min, max] values.
 * - min (number) → minimum slider value (default: 0).
 * - max (number) → maximum slider value (default: 100).
 * - step (number) → slider step size (default: 1).
 *
 * Notes:
 * - Uses internal state to manage both handles.
 * - Calls `onValueChange(newValues)` whenever either slider changes.
 * - Styling: first slider uses bronze accent (#A67C52),
 *            second uses gold accent (#D4AF37).
 */
export function Slider({ value, onValueChange, min = 0, max = 100, step = 1 }) {
  // Internal state for both slider values
  const [internal, setInternal] = React.useState(value || [min, max]);

  /**
   * Handle slider change.
   * - Updates the correct slider (by index 0/1).
   * - Syncs state and triggers external onValueChange callback if provided.
   */
  const handleChange = (e, index) => {
    const val = Number(e.target.value);
    const newVal = [...internal];
    newVal[index] = val;
    setInternal(newVal);
    onValueChange?.(newVal);
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* First slider (bronze accent) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={internal[0]}
        onChange={(e) => handleChange(e, 0)}
        className="w-full accent-[#A67C52]"
      />

      {/* Second slider (gold accent) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={internal[1]}
        onChange={(e) => handleChange(e, 1)}
        className="w-full accent-[#D4AF37]"
      />
    </div>
  );
}

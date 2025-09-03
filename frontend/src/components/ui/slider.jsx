import * as React from "react";

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1 }) {
  const [internal, setInternal] = React.useState(value || [min, max]);

  const handleChange = (e, index) => {
    const val = Number(e.target.value);
    const newVal = [...internal];
    newVal[index] = val;
    setInternal(newVal);
    onValueChange?.(newVal);
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={internal[0]}
        onChange={(e) => handleChange(e, 0)}
        className="w-full accent-[#A67C52]"
      />
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

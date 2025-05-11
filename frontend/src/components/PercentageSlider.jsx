// src/PercentageSlider.jsx
import { useState } from 'react';
import '../Styles/PercentageSlider.css';

const PercentageSlider = () => {
  // Retrieve the saved percentage value from localStorage (or default to 50)
  const savedPercentage = localStorage.getItem('percentage') || 50;
  const [percentage, setPercentage] = useState(savedPercentage);

  const handleSliderChange = (e) => {
    const newPercentage = e.target.value;
    setPercentage(newPercentage);
    // Save the new percentage value to localStorage
    localStorage.setItem('percentage', newPercentage);
  };

  return (
    <div className="slider-wrapper">
      {/* Display the percentage value above the slider */}
      <div className="percentage-value">{percentage}%</div>
      <input
        type="range"
        min="0"
        max="100"
        value={percentage}
        onChange={handleSliderChange}
        className="slider"
      />
    </div>
  );
};

export default PercentageSlider;
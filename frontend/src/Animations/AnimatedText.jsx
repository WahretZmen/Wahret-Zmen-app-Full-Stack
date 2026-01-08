// src/components/AnimatedText.jsx
import React from "react";
import "../Styles/StylesAnimatedText.css"; // ✅ Ensure animation CSS is imported

/**
 * AnimatedText
 * -------------
 * Props:
 * - text (string): The full string to animate word by word.
 *
 * Behavior:
 * - Splits the text into words.
 * - Each word is wrapped in <span>.
 * - Applies staggered animation delays (0.15s * index).
 */
const AnimatedText = ({ text }) => {
  // Split input string by spaces into words
  const words = text.split(" ");

  return (
    <div className="animated-text">
      {words.map((word, index) => (
        <span
          key={index}
          className="animated-word"
          // Delay each word a bit more than the previous one
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default AnimatedText;

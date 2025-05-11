import React from 'react';
import '../Styles/StylesAnimatedText.css'; // ✅ correct path to Styles folder

const AnimatedText = ({ text }) => {
  const words = text.split(" ");
  return (
    <div className="animated-text">
      {words.map((word, index) => (
        <span
          key={index}
          className="animated-word"
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default AnimatedText;

// src/components/common/ValueLabel.jsx
// A reusable component for displaying valuation category labels
import React from 'react';

const ValueLabel = ({ category, color }) => {
  return (
    <span
      className="px-2 py-1 rounded text-white text-xs font-bold"
      style={{ backgroundColor: color }}
    >
      {category}
    </span>
  );
};

export default ValueLabel;
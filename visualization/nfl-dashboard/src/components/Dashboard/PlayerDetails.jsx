// src/components/Dashboard/PlayerDetails.jsx
// This component shows detailed analysis for a single selected player
import React from 'react';

const PlayerDetails = ({ player }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-bold mb-4">Player Details: {player.name}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Valuation Analysis</h3>
          <div className="bg-gray-100 p-4 rounded">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Actual Salary:</span>
              <span className="font-medium">${player.actual_salary}M</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Predicted Salary:</span>
              <span className="font-medium">${player.predicted_salary}M</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Difference:</span>
              <span className={player.valuationDiff >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {player.valuationDiff >= 0 ? '+' : ''}${Math.abs(player.valuationDiff).toFixed(1)}M
              </span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Difference %:</span>
              <span className={player.valuationDiff >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {player.valuationDiff >= 0 ? '+' : ''}{player.valuationPercent.toFixed(1)}%
              </span>
            </div>
            <div className="mt-4">
              <span
                className="px-3 py-1 rounded text-white font-medium"
                style={{ backgroundColor: player.valuationColor }}
              >
                {player.valuationCategory}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;
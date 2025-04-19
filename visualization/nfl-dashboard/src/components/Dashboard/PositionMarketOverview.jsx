// src/components/Dashboard/PositionMarketOverview.jsx
// This component provides a market overview for each position group
import React from 'react';

const PositionMarketOverview = ({ positions, processedPlayers, setSelectedPosition }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-bold mb-4">Position Market Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {positions.map(position => {
          const positionPlayers = processedPlayers.filter(p => p.position === position);
          const avgSalary = positionPlayers.reduce((sum, p) => sum + p.actual_salary, 0) / positionPlayers.length;
          const avgPredicted = positionPlayers.reduce((sum, p) => sum + p.predicted_salary, 0) / positionPlayers.length;
          const undervaluedCount = positionPlayers.filter(p => p.valuationCategory === "Undervalued").length;
          const overvaluedCount = positionPlayers.filter(p => p.valuationCategory === "Overvalued").length;
          const fairValueCount = positionPlayers.filter(p => p.valuationCategory === "Fair Value").length;

          return (
            <div key={position} className="border rounded p-4">
              <h3 className="font-bold text-lg mb-2">{position}</h3>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <div className="text-sm text-gray-600">Avg. Actual Salary</div>
                  <div className="font-medium">${avgSalary.toFixed(1)}M</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Avg. Predicted Salary</div>
                  <div className="font-medium">${avgPredicted.toFixed(1)}M</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Player Count:</span>
                <span className="font-medium">{positionPlayers.length}</span>
              </div>
              <div className="flex items-center mb-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${(undervaluedCount / positionPlayers.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-green-600 font-medium">{undervaluedCount}</span>
              </div>
              <div className="flex items-center mb-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                  <div
                    className="h-2 rounded-full bg-yellow-500"
                    style={{ width: `${(fairValueCount / positionPlayers.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-yellow-600 font-medium">{fairValueCount}</span>
              </div>
              <div className="flex items-center mb-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{ width: `${(overvaluedCount / positionPlayers.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-red-600 font-medium">{overvaluedCount}</span>
              </div>
              <button
                className="w-full mt-2 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                onClick={() => setSelectedPosition(position)}
              >
                View {position} Players
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PositionMarketOverview;
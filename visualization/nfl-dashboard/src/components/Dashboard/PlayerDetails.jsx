// src/components/Dashboard/PlayerDetails.jsx
// This component shows detailed analysis for selected players
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { getFeatureLabels, calculatePositionAverages, createPlayerRadarData } from '../../utils/dataUtils';

const PlayerDetails = ({ selectedPlayers, allPlayers }) => {
  // Function to get radar data for a player
  const getPlayerRadarData = player => {
    // Get feature labels for this position
    const featureLabels = getFeatureLabels(player.position);

    // Calculate position averages from all players of the same position
    const positionPlayers = allPlayers.filter(p => p.position === player.position);
    const positionAverages = calculatePositionAverages(positionPlayers);

    // Use the dataUtils function to create normalized radar data
    return createPlayerRadarData(player, featureLabels, positionAverages);
  };

  // If no players are selected, don't render the component
  if (selectedPlayers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-bold mb-4">Player Details ({selectedPlayers.length})</h2>
      
      {/* Player Cards */}
      <div className="grid grid-cols-1 gap-6">
        {selectedPlayers.map((player, index) => (
          <div key={index} className="border-b pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
            <h3 className="font-bold text-lg mb-4">{player.name} - {player.position}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Valuation Analysis */}
              <div>
                <h4 className="font-medium mb-2">Valuation Analysis</h4>
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
              
              {/* Player Feature Radar Chart */}
              <div>
                <h4 className="font-medium mb-2">Feature Analysis</h4>
                <div className="bg-gray-100 p-4 rounded">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        outerRadius={90}
                        data={getPlayerRadarData(player)}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="feature" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar
                          name={player.name}
                          dataKey="value"
                          stroke={player.valuationColor}
                          fill={player.valuationColor}
                          fillOpacity={0.6}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 text-center px-2">
                    This radar chart shows normalized feature values compared to position average.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerDetails;
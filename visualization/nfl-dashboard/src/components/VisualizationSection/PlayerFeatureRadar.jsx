// src/components/Dashboard/VisualizationSection/PlayerFeatureRadar.jsx
// This component displays a radar chart showing a player's feature values compared to position averages
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { getFeatureLabels, calculatePositionAverages, createPlayerRadarData } from '../../utils/dataUtils';

const PlayerFeatureRadar = ({ selectedPlayers }) => {
  // Function to get radar data for a player
  const getPlayerRadarData = player => {
    // Get feature labels for this position
    const featureLabels = getFeatureLabels(player.position);

    // Calculate position averages from all players
    const positionAverages = calculatePositionAverages(selectedPlayers);

    // Use the dataUtils function to create normalized radar data
    return createPlayerRadarData(player, featureLabels, positionAverages);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      {selectedPlayers.length === 1 ? (
        <>
          <h2 className="font-bold mb-4">Player Feature Analysis: {selectedPlayers[0].name}</h2>
          <div className="radar-container">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  outerRadius={90}
                  data={getPlayerRadarData(selectedPlayers[0])}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="feature" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name={selectedPlayers[0].name}
                    dataKey="value"
                    stroke={selectedPlayers[0].valuationColor}
                    fill={selectedPlayers[0].valuationColor}
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
        </>
      ) : (
        <>
          <h2 className="font-bold mb-4">Feature Analysis</h2>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <p>Select a single player to view feature analysis</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerFeatureRadar;
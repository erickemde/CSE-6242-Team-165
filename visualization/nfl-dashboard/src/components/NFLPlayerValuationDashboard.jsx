// NFLPlayerValuationDashboard.jsx (Main Container)
import React, { useState, useEffect } from 'react';
import { loadPlayerDataFromCSV, generateFakePlayerData } from '../utils/dataUtils'; // Fixed import path
import ControlPanel from './Dashboard/ControlPanel';
import FeatureImpactVisualization from './Dashboard/FeatureImpactVisualization';
import VisualizationSection from './VisualizationSection';
import PlayerTable from './Dashboard/PlayerTable';
import SelectedPlayersPanel from './Dashboard/SelectedPlayersPanel';
import PlayerDetails from './Dashboard/PlayerDetails';
import PositionMarketOverview from './Dashboard/PositionMarketOverview';

const NFLPlayerValuationDashboard = () => {
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePosition, setActivePosition] = useState("QB");
  const [processedPlayers, setProcessedPlayers] = useState([]);

  // Process player data with valuation metrics
  const processPlayers = (players) => {
    return players.map(player => {
      const valuationDiff = player.predicted_salary - player.actual_salary;
      const valuationPercent = (valuationDiff / player.actual_salary) * 100;

      let valuationCategory;
      let valuationColor;

      if (valuationPercent >= 10) {
        valuationCategory = "Undervalued";
        valuationColor = "#4CAF50"; // Green
      } else if (valuationPercent <= -10) {
        valuationCategory = "Overvalued";
        valuationColor = "#F44336"; // Red
      } else {
        valuationCategory = "Fair Value";
        valuationColor = "#FFC107"; // Yellow
      }

      return {
        ...player,
        valuationDiff,
        valuationPercent,
        valuationCategory,
        valuationColor
      };
    });
  };

  // Get unique positions
  const positions = [...new Set(processedPlayers.map(player => player.position))];

  // Process players on component mount
  useEffect(() => {
    document.title = "NFL Player Valuation Dashboard"; // Set the page title

    // Get the base URL based on environment
    const baseUrl = process.env.PUBLIC_URL || '';

    // Try to load the real CSV data with the correct path
    loadPlayerDataFromCSV(`${baseUrl}/data/final_dashboard_data.csv`)
      .then((players) => {
        console.log('Loaded player data:', players);
        setProcessedPlayers(processPlayers(players));
      })
      .catch((error) => {
        console.error('Error loading CSV, falling back to sample data:', error);
        // If loading fails, use sample data as fallback
        setProcessedPlayers(processPlayers(generateFakePlayerData()));
      });
  }, []);

  // Filter players by position and search
  const filteredPlayers = processedPlayers.filter(player => {
    const positionMatch = selectedPosition === "All" || player.position === selectedPosition;
    const searchMatch = !searchQuery ||
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase());
    return positionMatch && searchMatch;
  });

  // Toggle player selection
  const togglePlayerSelection = player => {
    if (selectedPlayers.find(p => p.name === player.name)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.name !== player.name));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  return (
    <div className="p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">NFL Player Valuation Dashboard</h1>

      <ControlPanel
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
        positions={positions}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <FeatureImpactVisualization
        activePosition={activePosition}
        setActivePosition={setActivePosition}
        positions={positions}
      />

      <VisualizationSection
        filteredPlayers={filteredPlayers}
        selectedPlayers={selectedPlayers}
      />

      <PlayerTable
        filteredPlayers={filteredPlayers}
        selectedPlayers={selectedPlayers}
        togglePlayerSelection={togglePlayerSelection}
      />

      {selectedPlayers.length > 0 && (
        <>
          <SelectedPlayersPanel
            selectedPlayers={selectedPlayers}
            togglePlayerSelection={togglePlayerSelection}
          />
          
          {/* Updated to always display PlayerDetails when players are selected */}
          <PlayerDetails
            selectedPlayers={selectedPlayers}
            allPlayers={processedPlayers} // Pass all players for position average calculation
          />
        </>
      )}

      <PositionMarketOverview
        positions={positions}
        processedPlayers={processedPlayers}
        setSelectedPosition={setSelectedPosition}
      />

      {/* Footer with Info */}
      <div className="bg-white p-4 rounded shadow text-center text-gray-600 text-sm">
        <p>NFL Player Valuation Dashboard - CSE 6242 Project - Group 165</p>
        <p>Data processed using Exponential Smoothing and ML-based Valuation Models</p>
      </div>
    </div>
  );
};

export default NFLPlayerValuationDashboard;
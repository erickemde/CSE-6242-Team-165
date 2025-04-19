// src/components/Dashboard/VisualizationSection/index.jsx
// This component serves as a container for the visualization charts
import React from 'react';
import SalaryScatterPlot from './SalaryScatterPlot';
import PlayerFeatureRadar from './PlayerFeatureRadar';

const VisualizationSection = ({ filteredPlayers, selectedPlayers }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <SalaryScatterPlot filteredPlayers={filteredPlayers} />
      <PlayerFeatureRadar selectedPlayers={selectedPlayers} />
    </div>
  );
};

export default VisualizationSection;
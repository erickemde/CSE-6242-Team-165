// src/components/Dashboard/VisualizationSection/index.jsx
// This component serves as a container for the visualization charts
import React from 'react';
import SalaryScatterPlot from './SalaryScatterPlot';

const VisualizationSection = ({ filteredPlayers, selectedPlayers }) => {
  return (
    <div className="mb-6">
      <SalaryScatterPlot filteredPlayers={filteredPlayers} />
    </div>
  );
};

export default VisualizationSection;
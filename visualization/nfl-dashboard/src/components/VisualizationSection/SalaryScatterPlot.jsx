// src/components/Dashboard/VisualizationSection/SalaryScatterPlot.jsx
// This component creates a scatter plot comparing actual vs predicted salaries
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const SalaryScatterPlot = ({ filteredPlayers }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-4">Actual vs. Predicted Salary</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="actual_salary"
              name="Actual Salary"
              label={{ value: 'Actual Salary ($M)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              type="number"
              dataKey="predicted_salary"
              name="Predicted Salary"
              label={{ value: 'Predicted Salary ($M)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value, name) => {
                // Format the value with dollar sign
                return [`$${value}M`, name];
              }}
              labelFormatter={(_, payload) => {
                if (payload && payload.length > 0) {
                  const player = payload[0].payload;
                  return `${player.name}`;
                }
                return '';
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const player = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="font-bold">{player.name}</p>
                      <p>Actual Salary: ${player.actual_salary}M</p>
                      <p>Predicted Salary: ${player.predicted_salary}M</p>
                      <p>Difference: ${(player.predicted_salary - player.actual_salary).toFixed(1)}M</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Players"
              data={filteredPlayers}
              fill="#8884d8"
            >
              {filteredPlayers.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.valuationColor} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="legend-dot w-3 h-3 rounded-full bg-green-500 mr-1" style={{ backgroundColor: "#4CAF50" }}></div>
            <span className="text-sm">Undervalued</span>
          </div>
          <div className="flex items-center">
            <div className="legend-dot w-3 h-3 rounded-full bg-yellow-500 mr-1" style={{ backgroundColor: "#FFC107" }}></div>
            <span className="text-sm">Fair Value</span>
          </div>
          <div className="flex items-center">
            <div className="legend-dot w-3 h-3 rounded-full bg-red-500 mr-1" style={{ backgroundColor: "#F44336" }}></div>
            <span className="text-sm">Overvalued</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryScatterPlot;
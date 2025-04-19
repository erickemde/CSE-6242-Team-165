// src/components/Dashboard/FeatureImpactVisualization.jsx
// This component displays bar charts showing the impact of different features on player valuation
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFeatureLabels, getFeatureImpacts } from '../../utils/dataUtils';

const FeatureImpactVisualization = ({ activePosition, setActivePosition, positions }) => {
  const createFeatureImpactData = position => {
    const impact = getFeatureImpacts()[position];
    return [
      {
        feature: getFeatureLabels(position).feature_1,
        impact: impact.feature_1 * 100
      },
      {
        feature: getFeatureLabels(position).feature_2,
        impact: impact.feature_2 * 100
      },
      {
        feature: getFeatureLabels(position).feature_3,
        impact: impact.feature_3 * 100
      }
    ];
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-bold mb-4">Feature Impact by Position</h2>
      <div className="mb-4">
        <p className="text-gray-600 mb-2">Select a position to see how different features impact player valuation:</p>
        <div className="flex flex-wrap gap-2">
          {positions.map(pos => (
            <button
              key={pos}
              className={`px-3 py-1 rounded ${activePosition === pos ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setActivePosition(pos)}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Impact Bar Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={createFeatureImpactData(activePosition)}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="feature" />
              <YAxis domain={[0, 100]} label={{ value: 'Impact Weight (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Impact Weight']} />
              <Legend />
              <Bar dataKey="impact" name="Feature Impact" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Impact Explanation */}
        <div className="p-4 border rounded bg-gray-50">
          <h3 className="font-medium mb-3">How Features Impact {activePosition} Valuation</h3>
          <ul className="space-y-2">
            {createFeatureImpactData(activePosition).map((item, index) => (
              <li key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                <span><strong>{item.feature}</strong>: {item.impact}% impact on predicted salary</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              These values represent the relative importance of each feature in determining the predicted salary for {activePosition}s.
              Higher percentages indicate features that have a greater influence on valuation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureImpactVisualization;
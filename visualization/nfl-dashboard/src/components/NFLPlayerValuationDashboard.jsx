import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
// import { parsePlayerData, getFeatureLabels, calculatePositionAverages, createPlayerRadarData, generateFakePlayerData } from '../utils/dataUtils';

import {
  loadPlayerDataFromCSV,
  getFeatureLabels,
  calculatePositionAverages,
  createPlayerRadarData,
  generateFakePlayerData,
  getFeatureImpacts
} from '../utils/dataUtils';

// Generated data based on the dashboard_data.csv structure
const fakePlayers = generateFakePlayerData()

const NFLPlayerValuationDashboard = () => {
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

  // Create radar chart data for a player
  const getPlayerRadarData = player => {
    // Get feature labels for this position
    const featureLabels = getFeatureLabels(player.position);

    // Calculate position averages from all players
    const positionAverages = calculatePositionAverages(processedPlayers);

    // Use the dataUtils function to create normalized radar data
    return createPlayerRadarData(player, featureLabels, positionAverages);
  }

  const [selectedPosition, setSelectedPosition] = useState("All");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePosition, setActivePosition] = useState("QB"); // For feature impact visualization
  const [processedPlayers, setProcessedPlayers] = useState([]);
  const [budget, setBudget] = useState(100); // Default budget in millions
  const [budgetInput, setBudgetInput] = useState("100");

  // Get unique positions
  const positions = [...new Set(processedPlayers.map(player => player.position))];

  // Process players on component mount
  useEffect(() => {
    // Get the base URL based on environment
    const baseUrl = process.env.PUBLIC_URL || '';

    // Try to load the real CSV data with the correct path
    loadPlayerDataFromCSV(`${baseUrl}/data/dashboard_data.csv`)
      .then((players) => {
        console.log('Loaded player data:', players);
        setProcessedPlayers(processPlayers(players));
      })
      .catch((error) => {
        console.error('Error loading CSV, falling back to sample data:', error);
        // If loading fails, use sample data as fallback
        setProcessedPlayers(processPlayers(fakePlayers));
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

  // Calculate total selected salary
  const totalSelectedSalary = selectedPlayers.reduce((sum, player) => sum + player.actual_salary, 0);

  // Toggle player selection
  const togglePlayerSelection = player => {
    if (selectedPlayers.find(p => p.name === player.name)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.name !== player.name));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // Update budget
  const handleBudgetChange = (e) => {
    setBudgetInput(e.target.value);
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const parsedBudget = parseFloat(budgetInput);
    if (!isNaN(parsedBudget) && parsedBudget > 0) {
      setBudget(parsedBudget);
    }
  };


  return (
    <div className="p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">NFL Player Valuation Dashboard</h1>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Position Filter */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2 text-center">Position Filter</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              className={`px-3 py-1 rounded ${selectedPosition === "All" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setSelectedPosition("All")}
            >
              All
            </button>
            {positions.map(pos => (
              <button
                key={pos}
                className={`px-3 py-1 rounded ${selectedPosition === pos ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setSelectedPosition(pos)}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Search Players</h2>
          <div className="relative">
            <input
              type="text"
              className="w-full p-2 pl-10 border rounded"
              placeholder="Search by player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Budget Setting */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Budget Setting</h2>
          <form onSubmit={handleBudgetSubmit} className="flex">
            <div className="budget-input-container relative flex-grow">
              <span className="dollar-sign">$</span>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter budget in millions"
                value={budgetInput}
                onChange={handleBudgetChange}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded ml-4"
              style={{ marginLeft: '4px' }}
            >
              Set
            </button>
          </form>
          <div className="mt-2">
            <div className="flex justify-between">
              <span>Current Budget:</span>
              <span className="font-bold">${budget}M</span>
            </div>
            <div className="flex justify-between">
              <span>Selected Players:</span>
              <span className={totalSelectedSalary > budget ? "font-bold text-red-600" : "font-bold"}>
                ${totalSelectedSalary.toFixed(1)}M
              </span>
            </div>
            <div className="flex justify-between">
              <span>Remaining:</span>
              <span className={budget - totalSelectedSalary < 0 ? "font-bold text-red-600" : "font-bold text-green-600"}>
                ${(budget - totalSelectedSalary).toFixed(1)}M
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className={`h-2.5 rounded-full ${totalSelectedSalary > budget ? "bg-red-600" : "bg-green-600"}`}
                style={{ width: `${Math.min(100, (totalSelectedSalary / budget) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Impact Visualization */}
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

      {/* Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Salary Scatter Plot */}
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

        {/* Player Feature Radar Chart (when a player is selected) */}
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
      </div>

      {/* Player Table */}
      <div className="bg-white p-4 rounded shadow mb-6 overflow-auto">
        <h2 className="font-bold mb-4">Player Valuation Analysis</h2>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-right">Actual Salary ($M)</th>
              <th className="px-4 py-2 text-right">Predicted Salary ($M)</th>
              <th className="px-4 py-2 text-right">Difference ($M)</th>
              <th className="px-4 py-2 text-center">Valuation</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player, index) => {
              const diff = player.predicted_salary - player.actual_salary;
              return (
                <tr
                  key={index}
                  className={`border-b hover:bg-gray-50 ${selectedPlayers.find(p => p.name === player.name) ? 'bg-blue-50' : ''
                    }`}
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={!!selectedPlayers.find(p => p.name === player.name)}
                      onChange={() => togglePlayerSelection(player)}
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{player.name}</td>
                  <td className="px-4 py-2">{player.position}</td>
                  <td className="px-4 py-2 text-right">${player.actual_salary}</td>
                  <td className="px-4 py-2 text-right">${player.predicted_salary}</td>
                  <td className="px-4 py-2 text-right">
                    <span className={diff >= 0 ? "text-green-600" : "text-red-600"}>
                      {diff >= 0 ? '+' : ''}{diff.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className="px-2 py-1 rounded text-white text-xs font-bold"
                      style={{ backgroundColor: player.valuationColor }}
                    >
                      {player.valuationCategory}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Players Panel */}
      {selectedPlayers.length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-bold mb-4">Selected Players ({selectedPlayers.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedPlayers.map((player, index) => (
              <div key={index} className="border rounded p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{player.name}</div>
                  <div className="text-sm text-gray-600">{player.position} · ${player.actual_salary}M</div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => togglePlayerSelection(player)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>Total Selected Salary:</span>
              <span className={totalSelectedSalary > budget ? "text-red-600" : ""}>
                ${totalSelectedSalary.toFixed(1)}M
              </span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span>Remaining Budget:</span>
              <span className={budget - totalSelectedSalary < 0 ? "text-red-600" : "text-green-600"}>
                ${(budget - totalSelectedSalary).toFixed(1)}M
              </span>
            </div>
            <button
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Export Selected Players
            </button>
          </div>
        </div>
      )}

      {/* Player Details with Key Stats */}
      {selectedPlayers.length === 1 && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-bold mb-4">Player Details: {selectedPlayers[0].name}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Performance Metrics</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">{getFeatureLabels(selectedPlayers[0].position).feature_1}</td>
                    <td className="py-2 font-medium text-right">{selectedPlayers[0].feature_1}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">{getFeatureLabels(selectedPlayers[0].position).feature_2}</td>
                    <td className="py-2 font-medium text-right">{selectedPlayers[0].feature_2}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">{getFeatureLabels(selectedPlayers[0].position).feature_3}</td>
                    <td className="py-2 font-medium text-right">{selectedPlayers[0].feature_3}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Height</td>
                    <td className="py-2 font-medium text-right">{Math.floor(selectedPlayers[0].height / 12)}'{selectedPlayers[0].height % 12}"</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Weight</td>
                    <td className="py-2 font-medium text-right">{selectedPlayers[0].weight} lbs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-medium mb-2">Valuation Analysis</h3>
              <div className="bg-gray-100 p-4 rounded">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Actual Salary:</span>
                  <span className="font-medium">${selectedPlayers[0].actual_salary}M</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Predicted Salary:</span>
                  <span className="font-medium">${selectedPlayers[0].predicted_salary}M</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Difference:</span>
                  <span className={selectedPlayers[0].valuationDiff >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {selectedPlayers[0].valuationDiff >= 0 ? '+' : ''}${Math.abs(selectedPlayers[0].valuationDiff).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Difference %:</span>
                  <span className={selectedPlayers[0].valuationDiff >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {selectedPlayers[0].valuationDiff >= 0 ? '+' : ''}{selectedPlayers[0].valuationPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-4">
                  <span
                    className="px-3 py-1 rounded text-white font-medium"
                    style={{ backgroundColor: selectedPlayers[0].valuationColor }}
                  >
                    {selectedPlayers[0].valuationCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Position Market Overview */}
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

      {/* Footer with Info */}
      <div className="bg-white p-4 rounded shadow text-center text-gray-600 text-sm">
        <p>NFL Player Valuation Dashboard - CSE 6242 Project - Group 165</p>
        <p>Data processed using Exponential Smoothing and ML-based Valuation Models</p>
      </div>
    </div>
  );
};

export default NFLPlayerValuationDashboard;
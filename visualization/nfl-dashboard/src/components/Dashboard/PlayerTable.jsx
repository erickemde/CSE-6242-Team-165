// src/components/Dashboard/PlayerTable.jsx
// This component displays a table of all filtered players with their valuation data
import React, { useState } from 'react';

const PlayerTable = ({ filteredPlayers, selectedPlayers, togglePlayerSelection }) => {
  const [isTableVisible, setIsTableVisible] = useState(true);

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Player Valuation Analysis</h2>
        <button
          onClick={toggleTableVisibility}
          className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 flex items-center"
        >
          {isTableVisible ? 'Collapse' : 'Expand'} Table
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 ml-1 transition-transform ${isTableVisible ? '' : 'transform rotate-180'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {isTableVisible && (
        <>
          <div className="mb-2 text-sm text-gray-600">
            Showing {filteredPlayers.length} players
          </div>
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
        </>
      )}
    </div>
  );
};

export default PlayerTable;
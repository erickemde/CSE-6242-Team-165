// src/components/Dashboard/PlayerTable.jsx
// This component displays a table of all filtered players with their valuation data
import React from 'react';

const PlayerTable = ({ filteredPlayers, selectedPlayers, togglePlayerSelection }) => {
  return (
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
  );
};

export default PlayerTable;
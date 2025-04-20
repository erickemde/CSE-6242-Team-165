// src/components/Dashboard/SelectedPlayersPanel.jsx
// This component shows cards for all currently selected players
import React from 'react';

const SelectedPlayersPanel = ({ selectedPlayers, togglePlayerSelection }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-bold mb-4">Selected Players ({selectedPlayers.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedPlayers.map((player, index) => {
          return (
            <div key={index} className="border rounded p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium">{player.name}</div>
                  <div className="text-sm text-gray-600">{player.position}</div>
                </div>
                <span
                  className="px-2 py-1 rounded text-white text-xs font-bold"
                  style={{ backgroundColor: player.valuationColor }}
                >
                  {player.valuationCategory}
                </span>
              </div>
              <div className="text-right">
                <button
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => togglePlayerSelection(player)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedPlayersPanel;
// src/components/Dashboard/ControlPanel.jsx
// This component handles the position filtering and player search functionality
import React from 'react';

const ControlPanel = ({ 
  selectedPosition, 
  setSelectedPosition, 
  positions, 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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
    </div>
  );
};

export default ControlPanel;
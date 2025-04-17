// dataUtils.js - Utilities for processing NFL player data
import Papa from 'papaparse';

/**
 * Load and parse CSV data from a file
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array>} - Promise resolving to processed player data
 */
export const loadPlayerDataFromCSV = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    return parsePlayerData(csvText);
  } catch (error) {
    console.error('Error loading CSV data:', error);
    throw error;
  }
};

/**
 * Parse CSV content into player objects
 * @param {string} csvContent - CSV content as string
 * @returns {Array} - Array of player objects
 */
export const parsePlayerData = (csvContent) => {
  const result = Papa.parse(csvContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim()
  });
  
  if (result.errors && result.errors.length > 0) {
    console.warn('CSV parsing had errors:', result.errors);
  }
  
  return processPlayers(result.data);
};

/**
 * Process players to add valuation metrics
 * @param {Array} players - Array of player objects
 * @returns {Array} - Array of players with valuation metrics added
 */
export const processPlayers = (players) => {
  return players.map(player => {
    // Calculate valuation difference and percentage
    const valuationDiff = player.predicted_salary - player.actual_salary;
    const valuationPercent = (valuationDiff / player.actual_salary) * 100;
    
    // Categorize player value
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

/**
 * Get position-specific feature labels based on the player's position
 * @param {string} position - Player position code (QB, RB, etc.)
 * @returns {Object} - Object with position-specific feature labels
 */
export const getFeatureLabels = (position) => {
  const positionFeatureLabels = {
    QB: { 
      feature_1: "Completion %", 
      feature_2: "Passing Yards", 
      feature_3: "Touchdowns" 
    },
    RB: { 
      feature_1: "Yards Per Carry", 
      feature_2: "Rushing Yards", 
      feature_3: "Touchdowns" 
    },
    WR: { 
      feature_1: "Catch %", 
      feature_2: "Receiving Yards", 
      feature_3: "Touchdowns" 
    },
    TE: { 
      feature_1: "Catch %", 
      feature_2: "Receiving Yards", 
      feature_3: "Touchdowns" 
    },
    OL: { 
      feature_1: "PFF Grade", 
      feature_2: "Penalties", 
      feature_3: "Sacks Allowed" 
    }
  };
  
  return positionFeatureLabels[position] || {
    feature_1: "Feature 1",
    feature_2: "Feature 2",
    feature_3: "Feature 3"
  };
};

/**
 * Calculate position averages for all features
 * @param {Array} players - Array of player objects
 * @returns {Object} - Object with position codes as keys and average metrics as values
 */
export const calculatePositionAverages = (players) => {
  const positions = [...new Set(players.map(player => player.position))];
  const averages = {};
  
  positions.forEach(position => {
    const positionPlayers = players.filter(player => player.position === position);
    if (positionPlayers.length === 0) return;
    
    // Initialize averages object
    averages[position] = {
      feature_1: 0,
      feature_2: 0,
      feature_3: 0,
      actual_salary: 0,
      predicted_salary: 0,
      height: 0,
      weight: 0
    };
    
    // Sum all values
    positionPlayers.forEach(player => {
      Object.keys(averages[position]).forEach(key => {
        averages[position][key] += player[key] || 0;
      });
    });
    
    // Divide by count to get averages
    const count = positionPlayers.length;
    Object.keys(averages[position]).forEach(key => {
      averages[position][key] /= count;
    });
  });
  
  return averages;
};

/**
 * Create normalized radar chart data for player comparison
 * @param {Object} player - Player object
 * @param {Object} positionAverages - Average metrics for the player's position
 * @returns {Array} - Array of data points for radar chart
 */
export const createPlayerRadarData = (player, positionFeatureLabels, positionAverages) => {
  // If no position averages provided, calculate simple normalization
  if (!positionAverages) {
    return [
      { 
        feature: positionFeatureLabels.feature_1, 
        value: 80 // Placeholder normalized values
      },
      { 
        feature: positionFeatureLabels.feature_2, 
        value: 70 
      },
      { 
        feature: positionFeatureLabels.feature_3, 
        value: 90 
      }
    ];
  }
  
  // Calculate normalized values based on position averages
  const avgValues = positionAverages[player.position];
  
  // Normalize on 0-100 scale based on percentage of average
  const normalizeValue = (value, avgValue, isInverse = false) => {
    if (!avgValue) return 50; // Default to middle if no average
    
    // For metrics where lower is better (like penalties)
    if (isInverse) {
      return Math.max(0, Math.min(100, (1 - value / (avgValue * 2)) * 100));
    }
    
    // For metrics where higher is better
    return Math.max(0, Math.min(100, (value / (avgValue * 1.5)) * 100));
  };
  
  // Determine if a feature should be inversely scored (lower is better)
  const isInverseFeature = (position, feature) => {
    // Features where lower is better
    if (position === 'OL' && (feature === 'feature_2' || feature === 'feature_3')) {
      return true; // Penalties and sacks allowed - lower is better
    }
    return false;
  };
  
  return [
    { 
      feature: positionFeatureLabels.feature_1, 
      value: normalizeValue(
        player.feature_1, 
        avgValues.feature_1, 
        isInverseFeature(player.position, 'feature_1')
      )
    },
    { 
      feature: positionFeatureLabels.feature_2, 
      value: normalizeValue(
        player.feature_2, 
        avgValues.feature_2, 
        isInverseFeature(player.position, 'feature_2')
      )
    },
    { 
      feature: positionFeatureLabels.feature_3, 
      value: normalizeValue(
        player.feature_3, 
        avgValues.feature_3, 
        isInverseFeature(player.position, 'feature_3')
      )
    }
  ];
};

/**
 * Generate sample feature impact weights (model coefficients)
 * In a real application, these would come from your model
 */
export const getFeatureImpacts = () => {
  return {
    QB: { feature_1: 0.35, feature_2: 0.45, feature_3: 0.20 },
    RB: { feature_1: 0.50, feature_2: 0.30, feature_3: 0.20 },
    WR: { feature_1: 0.40, feature_2: 0.45, feature_3: 0.15 },
    TE: { feature_1: 0.35, feature_2: 0.40, feature_3: 0.25 },
    OL: { feature_1: 0.60, feature_2: 0.25, feature_3: 0.15 }
  };
};

/**
 * Generate fake player data for testing
 * @param {number} count - Number of players to generate
 * @returns {Array} - Array of processed player objects
 */
export const generateFakePlayerData = (count = 30) => {
  const positions = ["QB", "RB", "WR", "TE", "OL"];
  const firstNames = ["Patrick", "Tom", "Aaron", "Lamar", "Josh", "Russell", "Justin", "Dak", "Joe", "Jalen"];
  const lastNames = ["Mahomes", "Brady", "Rodgers", "Jackson", "Allen", "Wilson", "Herbert", "Prescott", "Burrow", "Hurts"];
  
  const players = [];
  
  for (let i = 0; i < count; i++) {
    const position = positions[Math.floor(Math.random() * positions.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Generate position-specific data
    let feature1, feature2, feature3;
    
    switch (position) {
      case "QB":
        feature1 = 55 + Math.random() * 15; // Completion percentage (55-70%)
        feature2 = 3000 + Math.random() * 2000; // Passing yards (3000-5000)
        feature3 = 15 + Math.random() * 25; // Touchdowns (15-40)
        break;
      case "RB":
        feature1 = 3.5 + Math.random() * 2.5; // Yards per carry (3.5-6.0)
        feature2 = 500 + Math.random() * 1000; // Rushing yards (500-1500)
        feature3 = 3 + Math.random() * 12; // Touchdowns (3-15)
        break;
      case "WR":
        feature1 = 55 + Math.random() * 20; // Catch percentage (55-75%)
        feature2 = 700 + Math.random() * 800; // Receiving yards (700-1500)
        feature3 = 3 + Math.random() * 9; // Touchdowns (3-12)
        break;
      case "TE":
        feature1 = 60 + Math.random() * 20; // Catch percentage (60-80%)
        feature2 = 400 + Math.random() * 600; // Receiving yards (400-1000)
        feature3 = 2 + Math.random() * 8; // Touchdowns (2-10)
        break;
      case "OL":
        feature1 = 60 + Math.random() * 30; // PFF grade (60-90)
        feature2 = Math.random() * 8; // Penalties (0-8)
        feature3 = Math.random() * 8; // Sacks allowed (0-8)
        break;
      default:
        feature1 = Math.random() * 100;
        feature2 = Math.random() * 1000;
        feature3 = Math.random() * 20;
    }
    
    // Generate physical attributes
    const height = position === "OL" ? 
      74 + Math.floor(Math.random() * 6) : // 6'2" to 6'8"
      70 + Math.floor(Math.random() * 8); // 5'10" to 6'6"
    
    const weight = position === "OL" ? 
      290 + Math.floor(Math.random() * 40) : // 290-330 lbs
      180 + Math.floor(Math.random() * 60); // 180-240 lbs
    
    // Generate salary data
    let actualSalary;
    switch (position) {
      case "QB":
        actualSalary = 20 + Math.random() * 30; // $20M-$50M
        break;
      case "WR":
        actualSalary = 15 + Math.random() * 15; // $15M-$30M
        break;
      case "OL":
        actualSalary = 10 + Math.random() * 15; // $10M-$25M
        break;
      case "TE":
        actualSalary = 8 + Math.random() * 8; // $8M-$16M
        break;
      case "RB":
        actualSalary = 5 + Math.random() * 10; // $5M-$15M
        break;
      default:
        actualSalary = 5 + Math.random() * 10;
    }
    
    // Add some variability to predicted salary
    const variability = (Math.random() * 2 - 1) * 0.2; // -20% to +20%
    const predictedSalary = actualSalary * (1 + variability);
    
    players.push({
      name: `${firstName} ${lastName}`,
      position,
      height,
      weight,
      feature_1: parseFloat(feature1.toFixed(1)),
      feature_2: parseFloat(feature2.toFixed(0)),
      feature_3: parseFloat(feature3.toFixed(0)),
      actual_salary: parseFloat(actualSalary.toFixed(1)),
      predicted_salary: parseFloat(predictedSalary.toFixed(1))
    });
  }
  
  return processPlayers(players);
};
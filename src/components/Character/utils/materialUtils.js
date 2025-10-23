/**
 * Material Management Utilities for Character Customization
 * Handles material mapping, color palettes, and material finder functions
 */

// Material name mappings for different character parts
export const MATERIAL_MAPPINGS = {
  skin: [
    'Material.001', // Face material
    'Material.002', // Hands/arms material
    'Skin',         // Alternative skin material name
    'Face',         // Face-specific material
    'Arms',         // Arms material
    'Body'          // Body skin material
  ],
  dress: [
    'Material.003', // Main dress material
    'Material.004', // Dress accent material
    'Dress',        // Alternative dress material name
    'Clothing',     // General clothing material
    'Outfit',       // Outfit material
    'Fabric'        // Fabric material
  ],
  hair: [
    'Material.005', // Hair material
    'Hair',         // Alternative hair material name
    'HairMaterial', // Hair-specific material
    'Strands'       // Hair strands material
  ],eyes: [
  '#8B4513', // Brown
  '#228B22', // Green  
  '#4169E1', // Blue
  '#2F4F4F', // Dark gray
  '#800080', // Purple
  '#FF8C00'  // Orange
]

};

// Color palette configurations for each customizable element
export const COLOR_PALETTES = {
  skin: [
    '#FDBCB4', // Light peachy
    '#F1C27D', // Light tan
    '#E0AC69', // Medium tan
    '#C68642', // Darker tan
    '#8D5524', // Deep brown
    '#F4C2A1', // Pale peach
    '#D4A574', // Golden tan
    '#B08D57'  // Olive tan
  ],
  dress: [
    '#FF6B6B', // Coral red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky blue
    '#96CEB4', // Mint green
    '#FFEAA7', // Soft yellow
    '#DDA0DD', // Plum
    '#F0A500', // Orange
    '#E17055'  // Terracotta
  ],
  hair: [
    '#2C3E50', // Dark blue-black
    '#8B4513', // Saddle brown
    '#DAA520', // Goldenrod
    '#CD853F', // Peru brown
    '#000000', // Pure black
    '#654321', // Dark brown
    '#D2691E', // Chocolate
    '#B22222'  // Fire brick red
  ],
  eyes: [
  '#8B4513', // Brown
  '#228B22', // Green  
  '#4169E1', // Blue
  '#2F4F4F', // Dark gray
  '#800080', // Purple
  '#FF8C00'  // Orange
]

};

// Default colors for each material type
export const DEFAULT_COLORS = {
  skin: '#FDBCB4',
  dress: '#4ECDC4', 
  hair: '#2C3E50'
};

/**
 * Find materials in a character model by material type
 * @param {THREE.Object3D} character - The character 3D model
 * @param {string} materialType - Type of material ('skin', 'dress', 'hair')
 * @returns {Array} Array of found materials
 */
export const findMaterialsByType = (character, materialType) => {
  if (!character || !materialType || !MATERIAL_MAPPINGS[materialType]) {
    console.warn(`Invalid character or material type: ${materialType}`);
    return [];
  }

  const foundMaterials = [];
  const materialNames = MATERIAL_MAPPINGS[materialType];

  character.traverse((child) => {
    if (child.isMesh && child.material) {
      // Handle both single materials and material arrays
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      
      materials.forEach((material) => {
        if (material && material.name) {
          // Check if material name matches any of the mapped names
          const isMatch = materialNames.some(mappedName => 
            material.name.toLowerCase().includes(mappedName.toLowerCase()) ||
            mappedName.toLowerCase().includes(material.name.toLowerCase())
          );
          
          if (isMatch && !foundMaterials.includes(material)) {
            foundMaterials.push(material);
          }
        }
      });
    }
  });

  return foundMaterials;
};

/**
 * Get all materials from a character model organized by type
 * @param {THREE.Object3D} character - The character 3D model
 * @returns {Object} Object containing arrays of materials by type
 */
export const getAllCharacterMaterials = (character) => {
  if (!character) {
    console.warn('No character provided to getAllCharacterMaterials');
    return { skin: [], dress: [], hair: [] };
  }

  return {
    skin: findMaterialsByType(character, 'skin'),
    dress: findMaterialsByType(character, 'dress'),
    hair: findMaterialsByType(character, 'hair')
  };
};

/**
 * Get available colors for a specific material type
 * @param {string} materialType - Type of material ('skin', 'dress', 'hair')
 * @returns {Array} Array of color hex codes
 */
export const getColorsForMaterialType = (materialType) => {
  return COLOR_PALETTES[materialType] || [];
};

/**
 * Get the default color for a material type
 * @param {string} materialType - Type of material ('skin', 'dress', 'hair')
 * @returns {string} Default color hex code
 */
export const getDefaultColor = (materialType) => {
  return DEFAULT_COLORS[materialType] || '#FFFFFF';
};

/**
 * Validate if a color is valid for a material type
 * @param {string} color - Hex color code
 * @param {string} materialType - Type of material
 * @returns {boolean} True if color is valid
 */
export const isValidColorForMaterial = (color, materialType) => {
  if (!color || !materialType) return false;
  
  // Check if it's a valid hex color
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexColorRegex.test(color)) return false;
  
  // Check if material type exists
  return Object.keys(COLOR_PALETTES).includes(materialType);
};

/**
 * Debug function to log all materials found in a character
 * @param {THREE.Object3D} character - The character 3D model
 */
export const debugCharacterMaterials = (character) => {
  if (!character) {
    console.log('No character provided for debugging');
    return;
  }

  console.log('=== Character Materials Debug ===');
  
  const allMaterials = new Set();
  character.traverse((child) => {
    if (child.isMesh && child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material && material.name) {
          allMaterials.add(material.name);
        }
      });
    }
  });

  console.log('All material names found:', Array.from(allMaterials));
  
  const organizedMaterials = getAllCharacterMaterials(character);
  console.log('Organized materials:', organizedMaterials);
  
  console.log('=== End Debug ===');
};
/*
*
 * Material Update Functions
 * Functions to update Three.js material properties with validation and error handling
 */

import * as THREE from 'three';

/**
 * Convert hex color to THREE.Color
 * @param {string} hexColor - Hex color code
 * @returns {THREE.Color} Three.js Color object
 */
const hexToThreeColor = (hexColor) => {
  try {
    return new THREE.Color(hexColor);
  } catch (error) {
    console.warn(`Invalid hex color: ${hexColor}`, error);
    return new THREE.Color('#FFFFFF'); // Default to white
  }
};

/**
 * Update material color with validation
 * @param {THREE.Material} material - Three.js material to update
 * @param {string} hexColor - New hex color
 * @returns {boolean} Success status
 */
const updateMaterialColor = (material, hexColor) => {
  if (!material) {
    console.warn('No material provided for color update');
    return false;
  }

  if (!hexColor || typeof hexColor !== 'string') {
    console.warn('Invalid hex color provided:', hexColor);
    return false;
  }

  try {
    const newColor = hexToThreeColor(hexColor);
    
    // Update different material properties based on material type
    if (material.color) {
      material.color.copy(newColor);
    }
    
    // For materials with diffuse maps, we might want to tint them
    if (material.map) {
      // Store original color if not already stored
      if (!material.userData.originalColor) {
        material.userData.originalColor = material.color.clone();
      }
    }
    
    // Mark material as needing update
    material.needsUpdate = true;
    
    return true;
  } catch (error) {
    console.error('Error updating material color:', error);
    return false;
  }
};

/**
 * Update multiple materials with the same color
 * @param {Array} materials - Array of Three.js materials
 * @param {string} hexColor - New hex color
 * @returns {Object} Result object with success count and errors
 */
export const updateMaterialsColor = (materials, hexColor) => {
  if (!Array.isArray(materials)) {
    console.warn('Materials must be an array');
    return { success: 0, errors: ['Materials must be an array'] };
  }

  if (!isValidHexColor(hexColor)) {
    const error = `Invalid hex color: ${hexColor}`;
    console.warn(error);
    return { success: 0, errors: [error] };
  }

  let successCount = 0;
  const errors = [];

  materials.forEach((material, index) => {
    const success = updateMaterialColor(material, hexColor);
    if (success) {
      successCount++;
    } else {
      errors.push(`Failed to update material at index ${index}`);
    }
  });

  return { success: successCount, errors };
};

/**
 * Update character materials by type
 * @param {THREE.Object3D} character - The character 3D model
 * @param {string} materialType - Type of material ('skin', 'dress', 'hair')
 * @param {string} hexColor - New hex color
 * @returns {Object} Result object with success status and details
 */
export const updateCharacterMaterial = (character, materialType, hexColor) => {
  if (!character) {
    const error = 'No character provided';
    console.warn(error);
    return { success: false, error, materialsUpdated: 0 };
  }

  if (!isValidColorForMaterial(hexColor, materialType)) {
    const error = `Invalid color ${hexColor} for material type ${materialType}`;
    console.warn(error);
    return { success: false, error, materialsUpdated: 0 };
  }

  const materials = findMaterialsByType(character, materialType);
  
  if (materials.length === 0) {
    const error = `No materials found for type: ${materialType}`;
    console.warn(error);
    return { success: false, error, materialsUpdated: 0 };
  }

  const result = updateMaterialsColor(materials, hexColor);
  
  return {
    success: result.success > 0,
    materialsUpdated: result.success,
    totalMaterials: materials.length,
    errors: result.errors,
    materialType
  };
};

/**
 * Validate hex color format
 * @param {string} color - Color to validate
 * @returns {boolean} True if valid hex color
 */
const isValidHexColor = (color) => {
  if (!color || typeof color !== 'string') return false;
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
};

/**
 * Reset material to its original color
 * @param {THREE.Material} material - Material to reset
 * @returns {boolean} Success status
 */
const resetMaterialColor = (material) => {
  if (!material) {
    console.warn('No material provided for reset');
    return false;
  }

  try {
    // Check if we have stored original color
    if (material.userData.originalColor) {
      material.color.copy(material.userData.originalColor);
    } else {
      // Fallback to white if no original color stored
      material.color.setHex(0xffffff);
    }
    
    material.needsUpdate = true;
    return true;
  } catch (error) {
    console.error('Error resetting material color:', error);
    return false;
  }
};

/**
 * Reset all materials of a specific type to default colors
 * @param {THREE.Object3D} character - The character 3D model
 * @param {string} materialType - Type of material to reset
 * @returns {Object} Result object with success status
 */
export const resetCharacterMaterial = (character, materialType) => {
  if (!character) {
    const error = 'No character provided';
    console.warn(error);
    return { success: false, error };
  }

  if (!Object.keys(DEFAULT_COLORS).includes(materialType)) {
    const error = `Invalid material type: ${materialType}`;
    console.warn(error);
    return { success: false, error };
  }

  const defaultColor = getDefaultColor(materialType);
  return updateCharacterMaterial(character, materialType, defaultColor);
};

/**
 * Reset all character materials to default colors
 * @param {THREE.Object3D} character - The character 3D model
 * @returns {Object} Result object with reset status for each material type
 */
export const resetAllCharacterMaterials = (character) => {
  if (!character) {
    console.warn('No character provided for reset');
    return { success: false, error: 'No character provided' };
  }

  const results = {};
  const materialTypes = Object.keys(DEFAULT_COLORS);

  materialTypes.forEach(materialType => {
    results[materialType] = resetCharacterMaterial(character, materialType);
  });

  const overallSuccess = Object.values(results).some(result => result.success);

  return {
    success: overallSuccess,
    results,
    message: overallSuccess ? 'Some materials reset successfully' : 'Failed to reset materials'
  };
};

/**
 * Store original material colors for later reset
 * @param {THREE.Object3D} character - The character 3D model
 */
export const storeOriginalMaterialColors = (character) => {
  if (!character) {
    console.warn('No character provided for storing original colors');
    return;
  }

  character.traverse((child) => {
    if (child.isMesh && child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      
      materials.forEach((material) => {
        if (material && material.color && !material.userData.originalColor) {
          material.userData.originalColor = material.color.clone();
        }
      });
    }
  });
};

/**
 * Batch update multiple material types at once
 * @param {THREE.Object3D} character - The character 3D model
 * @param {Object} colorUpdates - Object with materialType: hexColor pairs
 * @returns {Object} Results for each material type update
 */
export const batchUpdateCharacterMaterials = (character, colorUpdates) => {
  if (!character) {
    return { success: false, error: 'No character provided' };
  }

  if (!colorUpdates || typeof colorUpdates !== 'object') {
    return { success: false, error: 'Invalid color updates object' };
  }

  const results = {};
  let overallSuccess = false;

  Object.entries(colorUpdates).forEach(([materialType, hexColor]) => {
    results[materialType] = updateCharacterMaterial(character, materialType, hexColor);
    if (results[materialType].success) {
      overallSuccess = true;
    }
  });

  return {
    success: overallSuccess,
    results,
    message: overallSuccess ? 'Some materials updated successfully' : 'Failed to update materials'
  };
};
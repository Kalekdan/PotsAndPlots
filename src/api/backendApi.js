// Backend API client for PotsAndPlots Spring Boot backend

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  const response = await fetch(url, config);
  return handleResponse(response);
};

export async function getAreas() {
  return apiCall('/areas');
}

export async function getPlots() {
  return apiCall('/plots');
}

export async function getPlants() {
  return apiCall('/plants');
}

export async function getPlantTypes() {
  return apiCall('/plant-types');
}

export async function addPlant(plantData) {
  return apiCall('/plants', {
    method: 'POST',
    body: JSON.stringify({
      name: plantData.name,
      speciesId: plantData.species_id,
      areaId: plantData.area_id,
      plotId: plantData.plot_id,
      positionX: plantData.position?.x,
      positionY: plantData.position?.y,
      notes: plantData.notes || ''
    })
  });
}

export async function removePlant(plantId) {
  return apiCall(`/plants/${plantId}`, {
    method: 'DELETE'
  });
}

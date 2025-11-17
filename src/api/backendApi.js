// Backend API client for PotsAndPlots Spring Boot backend

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.text();
      if (errorData) {
        errorMessage += ` - ${errorData}`;
      }
    } catch (e) {
      // If we can't parse the error response, just use the status
    }
    console.error('API Error:', errorMessage);
    throw new Error(errorMessage);
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

export async function getPlant(plantId) {
  return apiCall(`/plants/${plantId}`);
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

export async function updatePlant(plantId, plantData) {
  const payload = {
    name: plantData.name,
    speciesId: plantData.speciesId,
    healthStatus: plantData.healthStatus,
    notes: plantData.notes,
    wateringSchedule: plantData.wateringSchedule,
    plantedDate: plantData.plantedDate
  };
  
  console.log('Updating plant:', plantId, 'with data:', payload);
  
  return apiCall(`/plants/${plantId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function movePlant(plantId, moveData) {
  console.log('Moving plant:', plantId, 'to:', moveData);
  
  return apiCall(`/plants/${plantId}/move`, {
    method: 'PUT',
    body: JSON.stringify(moveData)
  });
}

export async function removePlant(plantId) {
  return apiCall(`/plants/${plantId}`, {
    method: 'DELETE'
  });
}

export async function addPlot(plotData) {
  return apiCall('/plots', {
    method: 'POST',
    body: JSON.stringify(plotData)
  });
}

export async function updatePlot(plotId, plotData) {
  return apiCall(`/plots/${plotId}`, {
    method: 'PUT',
    body: JSON.stringify(plotData)
  });
}

export async function removePlot(plotId) {
  return apiCall(`/plots/${plotId}`, {
    method: 'DELETE'
  });
}

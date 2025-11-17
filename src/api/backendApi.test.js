import * as api from '../api/backendApi';

// Mock fetch
global.fetch = jest.fn();

describe('Backend API', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('getPlants returns plant data', async () => {
    const mockPlants = [
      { id: 1, name: 'Tomato', areaId: 1 },
      { id: 2, name: 'Basil', areaId: 1 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlants,
    });

    const result = await api.getPlants();
    
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/plants', {
      headers: { 'Content-Type': 'application/json' }
    });
    expect(result).toEqual(mockPlants);
  });

  test('addPlant creates new plant', async () => {
    const newPlant = { id: 1, name: 'New Tomato', speciesId: 1, areaId: 1 };
    const plantData = {
      name: 'New Tomato',
      species_id: 1,
      area_id: 1,
      plot_id: null,
      position: null
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newPlant,
    });

    const result = await api.addPlant(plantData);

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/plants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Tomato',
        speciesId: 1,
        areaId: 1,
        plotId: null,
        positionX: undefined,
        positionY: undefined,
        notes: ''
      })
    });
    expect(result).toEqual(newPlant);
  });

  test('addPlant with position creates plant with coordinates', async () => {
    const newPlant = { id: 1, name: 'New Tomato', positionX: 0, positionY: 0 };
    const plantData = {
      name: 'New Tomato',
      species_id: 1,
      area_id: 1,
      plot_id: 1,
      position: { x: 0, y: 0 }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newPlant,
    });

    await api.addPlant(plantData);

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/plants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Tomato',
        speciesId: 1,
        areaId: 1,
        plotId: 1,
        positionX: 0,
        positionY: 0,
        notes: ''
      })
    });
  });

  test('movePlant sends correct payload', async () => {
    const movedPlant = { id: 1, name: 'Tomato', areaId: 2, plotId: 2 };
    const moveData = {
      areaId: 2,
      plotId: 2,
      positionX: 1,
      positionY: 1
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => movedPlant,
    });

    const result = await api.movePlant(1, moveData);

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/plants/1/move', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moveData)
    });
    expect(result).toEqual(movedPlant);
  });

  test('removePlot returns success response', async () => {
    const successResponse = {
      success: true,
      message: 'Plot deleted successfully',
      plantsConverted: 2
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => successResponse,
    });

    const result = await api.removePlot(1);

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/plots/1', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    expect(result).toEqual(successResponse);
  });

  test('API handles error responses', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Position already occupied',
    });

    await expect(api.addPlant({ name: 'Test' })).rejects.toThrow(
      'HTTP error! status: 400 - Position already occupied'
    );
  });

  test('API handles network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(api.getPlants()).rejects.toThrow('Network error');
  });
});

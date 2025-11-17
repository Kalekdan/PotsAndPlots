import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlantDashboard from '../pages/PlantDashboard';
import * as api from '../api/backendApi';

// Mock the API module
jest.mock('../api/backendApi');

const mockAreas = [
  {
    id: 1,
    name: 'Front Garden',
    locationType: 'outdoor',
    brightness: 'full-sun',
    isGreenhouse: false,
    isCovered: false
  }
];

const mockPlots = [
  {
    id: 1,
    name: 'Tomato Bed',
    areaId: 1,
    plotType: 'raised-bed',
    width: 3,
    length: 2,
    soilType: 'loam',
    ph: 6.5,
    drainageLevel: 'good'
  }
];

const mockPlants = [
  {
    id: 1,
    name: 'Cherry Tomato',
    speciesId: 1,
    areaId: 1,
    plotId: 1,
    positionX: 0,
    positionY: 0,
    healthStatus: 'healthy'
  }
];

const mockPlantTypes = [
  {
    id: 1,
    commonName: 'Tomato',
    latinName: 'Solanum lycopersicum'
  }
];

describe('PlantDashboard', () => {
  beforeEach(() => {
    api.getAreas.mockResolvedValue(mockAreas);
    api.getPlots.mockResolvedValue(mockPlots);
    api.getPlants.mockResolvedValue(mockPlants);
    api.getPlantTypes.mockResolvedValue(mockPlantTypes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with areas, plots, and plants', async () => {
    render(
      <MemoryRouter>
        <PlantDashboard />
      </MemoryRouter>
    );

    // Check main title
    expect(screen.getByText('🌱 Pots & Plots')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('📍 Front Garden')).toBeInTheDocument();
    });

    // Check plot appears
    expect(screen.getByText('🧱 Tomato Bed')).toBeInTheDocument();
    
    // Check plant appears in grid
    expect(screen.getByText('Cherry Tomato')).toBeInTheDocument();
  });

  test('opens add plant dialog when clicking add button', async () => {
    render(
      <MemoryRouter>
        <PlantDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('📍 Front Garden')).toBeInTheDocument();
    });

    // Click add free-standing plant button
    const addButton = screen.getByText('+ Add Free-standing Plant');
    fireEvent.click(addButton);

    // Check dialog opens
    expect(screen.getByText('🌱 Add New Plant')).toBeInTheDocument();
  });

  test('opens add plot dialog when clicking add plot button', async () => {
    render(
      <MemoryRouter>
        <PlantDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('📍 Front Garden')).toBeInTheDocument();
    });

    // Click add plot button
    const addPlotButton = screen.getByText('+ Add Plot');
    fireEvent.click(addPlotButton);

    // Check dialog opens
    expect(screen.getByText('🧱 Add New Plot')).toBeInTheDocument();
  });

  test('displays plant in correct grid position', async () => {
    render(
      <MemoryRouter>
        <PlantDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Cherry Tomato')).toBeInTheDocument();
    });

    // Check that plant is displayed in a grid cell
    const plantElement = screen.getByText('Cherry Tomato');
    const gridCell = plantElement.closest('.grid-cell');
    expect(gridCell).toBeInTheDocument();
  });

  test('shows empty areas message when no areas exist', async () => {
    api.getAreas.mockResolvedValue([]);
    api.getPlots.mockResolvedValue([]);
    api.getPlants.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <PlantDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No areas found')).toBeInTheDocument();
    });
  });

  test('handles plant removal', async () => {
    api.removePlant.mockResolvedValue();

    render(
      <MemoryRouter>
        <PlantDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Cherry Tomato')).toBeInTheDocument();
    });

    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    // Find and click remove button
    const removeButton = screen.getAllByTitle('Remove plant')[0];
    fireEvent.click(removeButton);

    // Verify API was called
    await waitFor(() => {
      expect(api.removePlant).toHaveBeenCalledWith(1);
    });
  });

  test('handles plot removal with plant conversion', async () => {
    const mockResponse = {
      success: true,
      message: 'Plot deleted successfully',
      plantsConverted: 1
    };
    api.removePlot.mockResolvedValue(mockResponse);
    api.getPlants.mockResolvedValue([
      {
        ...mockPlants[0],
        plotId: null,
        positionX: null,
        positionY: null
      }
    ]);

    render(
      <MemoryRouter>
        <PlantDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('🧱 Tomato Bed')).toBeInTheDocument();
    });

    // Mock window.confirm and alert
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();

    // Find and click plot remove button
    const plotRemoveButton = screen.getByTitle('Remove plot');
    fireEvent.click(plotRemoveButton);

    // Verify API was called
    await waitFor(() => {
      expect(api.removePlot).toHaveBeenCalledWith(1);
      expect(window.alert).toHaveBeenCalledWith(
        'Plot "Tomato Bed" removed successfully. 1 plant converted to free-standing.'
      );
    });
  });
});

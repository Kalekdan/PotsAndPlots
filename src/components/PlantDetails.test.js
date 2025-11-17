import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlantDetails from '../pages/PlantDetails';
import * as api from '../api/backendApi';

// Mock the API module
jest.mock('../api/backendApi');

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ plantId: '1' }),
  useNavigate: () => mockNavigate,
}));

const mockPlant = {
  id: 1,
  name: 'Cherry Tomato',
  speciesId: 1,
  areaId: 1,
  plotId: 1,
  positionX: 0,
  positionY: 0,
  healthStatus: 'healthy',
  notes: 'Growing well',
  wateringSchedule: 'daily',
  plantedDate: '2024-01-15'
};

const mockAreas = [
  { id: 1, name: 'Front Garden' },
  { id: 2, name: 'Back Garden' }
];

const mockPlots = [
  {
    id: 1,
    name: 'Tomato Bed',
    areaId: 1,
    width: 3,
    length: 2
  },
  {
    id: 2,
    name: 'Herb Row',
    areaId: 2,
    width: 2,
    length: 1
  }
];

const mockPlantTypes = [
  {
    id: 1,
    commonName: 'Tomato',
    latinName: 'Solanum lycopersicum'
  }
];

describe('PlantDetails', () => {
  beforeEach(() => {
    api.getPlant.mockResolvedValue(mockPlant);
    api.getAreas.mockResolvedValue(mockAreas);
    api.getPlots.mockResolvedValue(mockPlots);
    api.getPlants.mockResolvedValue([mockPlant]);
    api.getPlantTypes.mockResolvedValue(mockPlantTypes);
    api.updatePlant.mockResolvedValue(mockPlant);
    api.movePlant.mockResolvedValue(mockPlant);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders plant details form', async () => {
    render(
      <MemoryRouter>
        <PlantDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Cherry Tomato')).toBeInTheDocument();
    });

    expect(screen.getByRole('combobox', { name: /health status/i })).toHaveValue('healthy');
    expect(screen.getByDisplayValue('Growing well')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /watering schedule/i })).toHaveValue('daily');
  });

  test('updates plant information', async () => {
    render(
      <MemoryRouter>
        <PlantDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Cherry Tomato')).toBeInTheDocument();
    });

    // Update plant name
    const nameInput = screen.getByDisplayValue('Cherry Tomato');
    fireEvent.change(nameInput, { target: { value: 'Updated Tomato' } });

    // Submit form
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.updatePlant).toHaveBeenCalledWith("1", expect.objectContaining({
        name: 'Updated Tomato'
      }));
    });
  });

  test('opens move plant dialog', async () => {
    render(
      <MemoryRouter>
        <PlantDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Cherry Tomato')).toBeInTheDocument();
    });

    // Click move plant button
    const moveButton = screen.getByTestId('move-plant-button');
    fireEvent.click(moveButton);

    // Check dialog opens
    expect(screen.getByText('Move Plant')).toBeInTheDocument();
  });

  test('moves plant to different area', async () => {
    render(
      <MemoryRouter>
        <PlantDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Cherry Tomato')).toBeInTheDocument();
    });

    // Open move dialog
    const moveButton = screen.getByTestId('move-plant-button');
    fireEvent.click(moveButton);

    // Select different area
    const areaSelect = screen.getByLabelText(/area/i);
    fireEvent.change(areaSelect, { target: { value: '2' } });

    // Select free-standing option
    const plotSelect = screen.getByLabelText(/plot/i);
    fireEvent.change(plotSelect, { target: { value: '' } });

    // Submit move
    const confirmMoveButton = screen.getByText('Move Plant');
    fireEvent.click(confirmMoveButton);

    await waitFor(() => {
      expect(api.movePlant).toHaveBeenCalledWith("1", {
        areaId: 2,
        plotId: null,
        positionX: null,
        positionY: null
      });
    });
  });

  test('moves plant to different plot with position selection', async () => {
    render(
      <MemoryRouter>
        <PlantDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Cherry Tomato')).toBeInTheDocument();
    });

    // Open move dialog
    const moveButton = screen.getByTestId('move-plant-button');
    fireEvent.click(moveButton);

    // Select different area and plot
    const areaSelect = screen.getByLabelText(/area/i);
    fireEvent.change(areaSelect, { target: { value: '2' } });

    const plotSelect = screen.getByLabelText(/plot/i);
    fireEvent.change(plotSelect, { target: { value: '2' } });

    await waitFor(() => {
      // Position grid should appear
      expect(screen.getByText(/Choose new position in/i)).toBeInTheDocument();
    });

    // Click position (0,0)
    const positionButton = screen.getByTitle('Position (0, 0)');
    fireEvent.click(positionButton);

    // Submit move
    const confirmMoveButton = screen.getByText('Move Plant');
    fireEvent.click(confirmMoveButton);

    await waitFor(() => {
      expect(api.movePlant).toHaveBeenCalledWith("1", {
        areaId: 2,
        plotId: 2,
        positionX: 0,
        positionY: 0
      });
    });
  });

  test('prevents moving to occupied position', async () => {
    // Mock another plant at position (0,0) in target plot
    const otherPlant = {
      id: 2,
      name: 'Other Plant',
      plotId: 2,
      positionX: 0,
      positionY: 0
    };
    api.getPlants.mockResolvedValue([mockPlant, otherPlant]);

    render(
      <MemoryRouter>
        <PlantDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Cherry Tomato')).toBeInTheDocument();
    });

    // Open move dialog
    const moveButton = screen.getByTestId('move-plant-button');
    fireEvent.click(moveButton);

    // Select different area and plot
    const areaSelect = screen.getByLabelText(/area/i);
    fireEvent.change(areaSelect, { target: { value: '2' } });

    const plotSelect = screen.getByLabelText(/plot/i);
    fireEvent.change(plotSelect, { target: { value: '2' } });

    await waitFor(() => {
      // Position (0,0) should be disabled/occupied
      const occupiedPosition = screen.getByTitle('Position occupied');
      expect(occupiedPosition).toBeDisabled();
    });
  });

  test('validates form fields', async () => {
    render(
      <MemoryRouter>
        <PlantDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Cherry Tomato')).toBeInTheDocument();
    });

    // Clear required field
    const nameInput = screen.getByDisplayValue('Cherry Tomato');
    fireEvent.change(nameInput, { target: { value: '' } });

    // Try to submit
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    // Should show validation error
    expect(api.updatePlant).not.toHaveBeenCalled();
  });
});

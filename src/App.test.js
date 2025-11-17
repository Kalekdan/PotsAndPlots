import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the API module
jest.mock('./api/backendApi', () => ({
  getAreas: jest.fn(() => Promise.resolve([])),
  getPlots: jest.fn(() => Promise.resolve([])),
  getPlants: jest.fn(() => Promise.resolve([])),
  getPlantTypes: jest.fn(() => Promise.resolve([])),
}));

test('renders plant dashboard', () => {
  render(<App />);
  
  // Test that the main title is rendered
  expect(screen.getByText(/Pots & Plots/i)).toBeInTheDocument();
});

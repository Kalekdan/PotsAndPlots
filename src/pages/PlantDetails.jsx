import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPlant,
  updatePlant,
  movePlant,
  getPlantTypes,
  getAreas,
  getPlots,
  getPlants
} from '../api/backendApi';
import './PlantDetails.css';

export default function PlantDetails() {
  const { plantId } = useParams();
  const navigate = useNavigate();
  
  const [plant, setPlant] = useState(null);
  const [plantTypes, setPlantTypes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [plots, setPlots] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    speciesId: '',
    healthStatus: '',
    notes: '',
    wateringSchedule: '',
    plantedDate: ''
  });

  const [moveData, setMoveData] = useState({
    areaId: '',
    plotId: ''
  });
  
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [moveSelectedPosition, setMoveSelectedPosition] = useState(null);

  useEffect(() => {
    loadData();
  }, [plantId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [plantData, plantTypesData, areasData, plotsData, plantsData] = await Promise.all([
        getPlant(plantId),
        getPlantTypes(),
        getAreas(),
        getPlots(),
        getPlants()
      ]);
      
      if (!plantData) {
        setError('Plant not found');
        return;
      }
      
      setPlant(plantData);
      setPlantTypes(plantTypesData);
      setAreas(areasData);
      setPlots(plotsData);
      setPlants(plantsData);
      
      setFormData({
        name: plantData.name || '',
        speciesId: plantData.speciesId || '',
        healthStatus: plantData.healthStatus || 'healthy',
        notes: plantData.notes || '',
        wateringSchedule: plantData.wateringSchedule || 'weekly',
        plantedDate: plantData.plantedDate || ''
      });

      setMoveData({
        areaId: plantData.areaId || '',
        plotId: plantData.plotId || ''
      });
      
    } catch (err) {
      console.error('Failed to load plant data:', err);
      setError('Failed to load plant data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const updatedPlant = await updatePlant(plantId, formData);
      setPlant(updatedPlant);
      // Show success message or redirect
      alert('Plant updated successfully!');
    } catch (err) {
      console.error('Failed to update plant:', err);
      setError('Failed to update plant');
    } finally {
      setSaving(false);
    }
  };

  const openMoveDialog = () => {
    setMoveData({
      areaId: plant?.areaId?.toString() || '',
      plotId: plant?.plotId?.toString() || ''
    });
    setMoveSelectedPosition(null);
    setShowMoveDialog(true);
  };

  const findFirstAvailablePositionInPlot = (plotId) => {
    const plot = plots.find(p => p.id === parseInt(plotId));
    if (!plot) return null;

    // Get all plants in this plot (excluding the current plant being moved)
    const plotPlants = plants.filter(p => 
      p.plotId === parseInt(plotId) && p.id !== parseInt(plantId)
    );
    
    const occupiedPositions = new Set();
    plotPlants.forEach(plant => {
      if (plant.positionX !== null && plant.positionY !== null) {
        occupiedPositions.add(`${plant.positionX},${plant.positionY}`);
      }
    });

    // Find first available position
    for (let y = 0; y < plot.length; y++) {
      for (let x = 0; x < plot.width; x++) {
        if (!occupiedPositions.has(`${x},${y}`)) {
          return { x, y };
        }
      }
    }
    return null; // Plot is full
  };

  const handleMoveAreaChange = (newAreaId) => {
    setMoveData({
      areaId: newAreaId,
      plotId: ''
    });
    setMoveSelectedPosition(null);
  };

  const handleMovePlotChange = (newPlotId) => {
    setMoveData({
      ...moveData,
      plotId: newPlotId
    });

    if (newPlotId) {
      const firstAvailable = findFirstAvailablePositionInPlot(newPlotId);
      if (!firstAvailable) {
        alert('Selected plot is full. Please choose another plot.');
        setMoveData({...moveData, plotId: ''});
        return;
      }
      setMoveSelectedPosition(firstAvailable);
    } else {
      setMoveSelectedPosition(null);
    }
  };

  const handleMove = async () => {
    if (!moveData.areaId) {
      alert('Please select an area');
      return;
    }

    // Validate position selection for plots
    if (moveData.plotId && !moveSelectedPosition) {
      alert('Please select a position in the plot');
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      const movePayload = {
        areaId: parseInt(moveData.areaId),
        plotId: moveData.plotId ? parseInt(moveData.plotId) : null,
        positionX: moveSelectedPosition?.x ?? null,
        positionY: moveSelectedPosition?.y ?? null
      };
      
      const movedPlant = await movePlant(plantId, movePayload);
      setPlant(movedPlant);
      
      // Reload data to get updated area/plot info
      await loadData();
      
      setShowMoveDialog(false);
      alert('Plant moved successfully!');
    } catch (err) {
      console.error('Failed to move plant:', err);
      let errorMessage = 'Failed to move plant';
      
      if (err.message && err.message.includes('already occupied')) {
        errorMessage = err.message;
      } else if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const renderMovePositionSelector = () => {
    if (!moveData.plotId) return null;
    
    const plot = plots.find(p => p.id === parseInt(moveData.plotId));
    if (!plot) return null;

    // Get all plants in this plot (excluding the current plant being moved)
    const plotPlants = plants.filter(p => 
      p.plotId === parseInt(moveData.plotId) && p.id !== parseInt(plantId)
    );
    
    const occupiedPositions = new Set();
    plotPlants.forEach(plant => {
      if (plant.positionX !== null && plant.positionY !== null) {
        occupiedPositions.add(`${plant.positionX},${plant.positionY}`);
      }
    });

    const grid = [];
    for (let y = 0; y < plot.length; y++) {
      const row = [];
      for (let x = 0; x < plot.width; x++) {
        const isOccupied = occupiedPositions.has(`${x},${y}`);
        const isSelected = moveSelectedPosition && moveSelectedPosition.x === x && moveSelectedPosition.y === y;
        
        row.push(
          <button
            key={`${x},${y}`}
            type="button"
            className={`position-cell ${isOccupied ? 'occupied' : 'available'} ${isSelected ? 'selected' : ''}`}
            onClick={() => !isOccupied && setMoveSelectedPosition({ x, y })}
            disabled={isOccupied}
            title={isOccupied ? 'Position occupied' : `Position (${x}, ${y})`}
          >
            {isOccupied ? '🌱' : isSelected ? '✓' : ''}
            <span className="position-coords">({x},{y})</span>
          </button>
        );
      }
      grid.push(
        <div key={y} className="position-row">
          {row}
        </div>
      );
    }

    return (
      <div className="position-grid">
        <div className="position-grid-header">
          <span>Choose new position in {plot.name} ({plot.width}×{plot.length})</span>
        </div>
        {grid}
      </div>
    );
  };

  const getPlantTypeName = (id) => {
    const plantType = plantTypes.find(pt => pt.id === parseInt(id));
    return plantType ? plantType.commonName : 'Unknown';
  };

  const getAreaName = (id) => {
    const area = areas.find(a => a.id === id);
    return area ? area.name : 'Unknown';
  };

  const getPlotName = (id) => {
    const plot = plots.find(p => p.id === id);
    return plot ? plot.name : 'No plot';
  };

  if (loading) {
    return (
      <div className="plant-details-container">
        <div className="loading-state">
          <div className="loading-spinner">🌱</div>
          <p>Loading plant details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="plant-details-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="plant-details-container">
      <header className="plant-details-header">
        <button 
          onClick={() => navigate(-1)} 
          className="back-button"
          title="Go back"
        >
          ← Back
        </button>
        <div className="header-info">
          <h1 className="plant-title">🌱 {plant?.name}</h1>
          <p className="plant-subtitle">
            {getPlantTypeName(plant?.speciesId)} • {getAreaName(plant?.areaId)}
            {plant?.plotId && ` • ${getPlotName(plant?.plotId)}`}
          </p>
        </div>
      </header>

      <div className="plant-details-content">
        <div className="plant-info-section">
          <div className="info-card">
            <h3>📍 Location Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Area:</label>
                <span>{getAreaName(plant?.areaId)}</span>
              </div>
              {plant?.plotId && (
                <div className="info-item">
                  <label>Plot:</label>
                  <span>{getPlotName(plant?.plotId)}</span>
                </div>
              )}
              {plant?.positionX !== null && plant?.positionY !== null && (
                <div className="info-item">
                  <label>Position:</label>
                  <span>({plant.positionX}, {plant.positionY})</span>
                </div>
              )}
              {plant?.plantedDate && (
                <div className="info-item">
                  <label>Planted:</label>
                  <span>{new Date(plant.plantedDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="info-card">
            <h3>🌿 Plant Type Information</h3>
            <div className="plant-type-info">
              <p><strong>Common Name:</strong> {getPlantTypeName(plant?.speciesId)}</p>
              {plantTypes.find(pt => pt.id === plant?.speciesId)?.latinName && (
                <p><strong>Scientific Name:</strong> <em>{plantTypes.find(pt => pt.id === plant?.speciesId).latinName}</em></p>
              )}
            </div>
          </div>
        </div>

        <div className="edit-form-section">
          <div className="move-plant-section">
            <h3>🚚 Move Plant</h3>
            <p className="move-description">
              Move this plant to a different area or plot location.
            </p>
            <button 
              type="button"
              onClick={openMoveDialog}
              className="btn-secondary"
              disabled={saving}
              data-testid="move-plant-button"
            >
              🚚 Move Plant
            </button>
          </div>

          <form onSubmit={handleSubmit} className="edit-form">
            <h3>✏️ Edit Plant Details</h3>
            
            <div className="form-group">
              <label htmlFor="name">Plant Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter plant name..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="speciesId">Plant Type *</label>
              <select
                id="speciesId"
                name="speciesId"
                value={formData.speciesId}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="">Select plant type...</option>
                {plantTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.commonName} ({type.latinName})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="healthStatus">Health Status</label>
              <select
                id="healthStatus"
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="healthy">🟢 Healthy</option>
                <option value="sick">🔴 Sick</option>
                <option value="recovering">🟡 Recovering</option>
                <option value="dormant">🟤 Dormant</option>
                <option value="flowering">🌸 Flowering</option>
                <option value="fruiting">🍎 Fruiting</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="wateringSchedule">Watering Schedule</label>
              <select
                id="wateringSchedule"
                name="wateringSchedule"
                value={formData.wateringSchedule}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="daily">Daily</option>
                <option value="every-other-day">Every Other Day</option>
                <option value="twice-weekly">Twice Weekly</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="plantedDate">Planted Date</label>
              <input
                type="date"
                id="plantedDate"
                name="plantedDate"
                value={formData.plantedDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
                placeholder="Add any notes about this plant..."
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={saving || !formData.name.trim() || !formData.speciesId}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showMoveDialog && (
        <div className="modal-overlay" onClick={() => setShowMoveDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🚚 Move Plant</h3>
              <button 
                onClick={() => setShowMoveDialog(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="move-area-select">Move to Area *</label>
                <select
                  id="move-area-select"
                  value={moveData.areaId}
                  onChange={(e) => handleMoveAreaChange(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select area...</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name} - {area.locationType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="move-plot-select">Move to Plot (optional)</label>
                <select
                  id="move-plot-select"
                  value={moveData.plotId}
                  onChange={(e) => handleMovePlotChange(e.target.value)}
                  className="form-select"
                  disabled={!moveData.areaId}
                >
                  <option value="">Free-standing (no plot)</option>
                  {plots
                    .filter(plot => plot.areaId === parseInt(moveData.areaId))
                    .map(plot => (
                      <option key={plot.id} value={plot.id}>
                        {plot.name} ({plot.plotType})
                      </option>
                    ))}
                </select>
              </div>

              {moveData.plotId && (
                <div className="form-group">
                  <label>Select Position in Plot</label>
                  <div className="position-selector">
                    {renderMovePositionSelector()}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setShowMoveDialog(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button 
                onClick={handleMove}
                className="btn-primary"
                disabled={saving || !moveData.areaId || 
                         (moveData.plotId && !moveSelectedPosition)}
              >
                {saving ? 'Moving...' : 'Move Plant'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

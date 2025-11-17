import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAreas,
  getPlots,
  getPlants,
  getPlantTypes,
  addPlant,
  removePlant,
  addPlot,
  removePlot,
} from '../api/backendApi';
import './PlantDashboard.css';

export default function PlantDashboard() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [plots, setPlots] = useState([]);
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlantType, setSelectedPlantType] = useState('');
  const [newPlantName, setNewPlantName] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addPlantContext, setAddPlantContext] = useState(null);
  const [showAddPlotDialog, setShowAddPlotDialog] = useState(false);
  const [addPlotContext, setAddPlotContext] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [newPlotData, setNewPlotData] = useState({
    name: '',
    plotType: 'raised-bed',
    width: 2,
    length: 3,
    soilType: 'loam',
    ph: 7.0,
    drainageLevel: 'good'
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [a, p, pl, pt] = await Promise.all([
          getAreas(),
          getPlots(),
          getPlants(),
          getPlantTypes(),
        ]);
        setAreas(a);
        setPlots(p);
        setPlants(pl);
        setPlantTypes(pt);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const getPlantType = (id) =>
    plantTypes.find((pt) => pt.id === id)?.commonName || 'Unknown';

  const handleRemovePlant = async (plantId, plantName) => {
    if (!window.confirm(`Are you sure you want to remove "${plantName}"?`)) return;
    
    setLoading(true);
    try {
      await removePlant(plantId);
      setPlants(plants.filter(p => p.id !== plantId));
    } catch (error) {
      console.error('Failed to remove plant:', error);
      alert('Failed to remove plant');
    }
    setLoading(false);
  };

  const openAddDialog = (areaId, plotId = null, position = null) => {
    setAddPlantContext({ areaId, plotId, position });
    
    // If adding to a plot without specific position, find first available position
    if (plotId && !position) {
      const plot = plots.find(p => p.id === plotId);
      if (plot) {
        const availablePosition = findFirstAvailablePosition(plot);
        if (!availablePosition) {
          alert(`Plot "${plot.name}" is full. All positions are occupied.`);
          return;
        }
        setSelectedPosition(availablePosition);
      }
    } else if (position) {
      setSelectedPosition(position);
    } else {
      setSelectedPosition(null);
    }
    
    setShowAddDialog(true);
    setNewPlantName('');
    setSelectedPlantType('');
  };

  const findFirstAvailablePosition = (plot) => {
    const plotPlants = plants.filter(p => p.plotId === plot.id);
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

  const renderPositionSelector = () => {
    if (!addPlantContext?.plotId) return null;
    
    const plot = plots.find(p => p.id === addPlantContext.plotId);
    if (!plot) return null;

    const plotPlants = plants.filter(p => p.plotId === plot.id);
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
        const isSelected = selectedPosition && selectedPosition.x === x && selectedPosition.y === y;
        
        row.push(
          <button
            key={`${x},${y}`}
            type="button"
            className={`position-cell ${isOccupied ? 'occupied' : 'available'} ${isSelected ? 'selected' : ''}`}
            onClick={() => !isOccupied && setSelectedPosition({ x, y })}
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
          <span>Choose position in {plot.name} ({plot.width}×{plot.length})</span>
        </div>
        {grid}
      </div>
    );
  };

  const handleAddPlant = async () => {
    if (!newPlantName.trim() || !selectedPlantType) {
      alert('Please enter a plant name and select a type');
      return;
    }

    // Validate position selection for plots
    if (addPlantContext?.plotId && !selectedPosition && !addPlantContext.position) {
      alert('Please select a position in the plot');
      return;
    }

    setLoading(true);
    try {
      const newPlant = await addPlant({
        name: newPlantName.trim(),
        species_id: parseInt(selectedPlantType),
        area_id: addPlantContext.areaId,
        plot_id: addPlantContext.plotId,
        position: selectedPosition || addPlantContext.position
      });
      setPlants([...plants, newPlant]);
      setShowAddDialog(false);
    } catch (error) {
      console.error('Failed to add plant:', error);
      let errorMessage = 'Failed to add plant';
      
      if (error.message && error.message.includes('already occupied')) {
        errorMessage = error.message;
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
    }
    setLoading(false);
  };

  const openAddPlotDialog = (areaId) => {
    setAddPlotContext({ areaId });
    setShowAddPlotDialog(true);
    setNewPlotData({
      name: '',
      plotType: 'raised-bed',
      width: 2,
      length: 3,
      soilType: 'loam',
      ph: 7.0,
      drainageLevel: 'good'
    });
  };

  const handleAddPlot = async () => {
    if (!newPlotData.name.trim()) {
      alert('Please enter a plot name');
      return;
    }

    setLoading(true);
    try {
      const newPlot = await addPlot({
        ...newPlotData,
        areaId: addPlotContext.areaId,
        name: newPlotData.name.trim()
      });
      setPlots([...plots, newPlot]);
      setShowAddPlotDialog(false);
    } catch (error) {
      console.error('Failed to add plot:', error);
      alert('Failed to add plot');
    }
    setLoading(false);
  };

  const handleRemovePlot = async (plotId, plotName) => {
    if (!window.confirm(`Are you sure you want to remove plot "${plotName}"? All plants in this plot will become free-standing.`)) return;
    
    setLoading(true);
    try {
      const result = await removePlot(plotId);
      setPlots(plots.filter(p => p.id !== plotId));
      
      // Show success message with plant conversion info
      if (result && result.plantsConverted !== undefined) {
        const plantText = result.plantsConverted === 1 ? 'plant' : 'plants';
        alert(`Plot "${plotName}" removed successfully. ${result.plantsConverted} ${plantText} converted to free-standing.`);
      } else {
        alert(`Plot "${plotName}" removed successfully.`);
      }
      
      // Reload plants to update their plot status
      const updatedPlants = await getPlants();
      setPlants(updatedPlants);
    } catch (error) {
      console.error('Failed to remove plot:', error);
      let errorMessage = 'Failed to remove plot';
      
      if (error.message) {
        errorMessage += ': ' + error.message;
      } else if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage += ': ' + error.response.data;
        } else if (error.response.data.message) {
          errorMessage += ': ' + error.response.data.message;
        }
      }
      
      alert(errorMessage);
    }
    setLoading(false);
  };

  const renderPlant = (plant) => (
    <div key={plant.id} className="plant-card">
      <div 
        className="plant-info clickable" 
        onClick={() => navigate(`/plant/${plant.id}`)}
        title="Click to edit plant details"
      >
        <h4 className="plant-name">{plant.name}</h4>
        <p className="plant-type">{getPlantType(plant.speciesId)}</p>
        {plant.healthStatus && (
          <span className={`health-badge ${plant.healthStatus.toLowerCase()}`}>
            {plant.healthStatus}
          </span>
        )}
        {plant.notes && <p className="plant-notes">{plant.notes}</p>}
      </div>
      <div className="plant-actions">
        <button 
          onClick={() => navigate(`/plant/${plant.id}`)}
          className="edit-btn"
          disabled={loading}
          title="Edit plant"
        >
          ✏️
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleRemovePlant(plant.id, plant.name);
          }}
          className="remove-btn"
          disabled={loading}
          title="Remove plant"
        >
          🗑️
        </button>
      </div>
    </div>
  );

  const renderPlotGrid = (plot) => {
    const grid = [];
    const plotPlants = plants.filter((p) => p.plotId === plot.id);

    // Create lookup by x/y for quick fill
    const plantMap = {};
    plotPlants.forEach((p) => {
      if (p.positionX !== null && p.positionY !== null) {
        plantMap[`${p.positionX},${p.positionY}`] = p;
      }
    });

    for (let y = 0; y < plot.length; y++) {
      const row = [];
      for (let x = 0; x < plot.width; x++) {
        const key = `${x},${y}`;
        const plant = plantMap[key];
        row.push(
          <div key={key} className="grid-cell">
            {plant ? (
              <div 
                className="grid-plant"
                onClick={() => navigate(`/plant/${plant.id}`)}
                title="Click to edit plant details"
              >
                <div className="grid-plant-info clickable">
                  <div className="grid-plant-name">{plant.name}</div>
                  <div className="grid-plant-type">{getPlantType(plant.speciesId)}</div>
                </div>
                <div className="grid-plant-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/plant/${plant.id}`);
                    }}
                    className="grid-edit-btn"
                    disabled={loading}
                    title="Edit plant"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePlant(plant.id, plant.name);
                    }}
                    className="grid-remove-btn"
                    disabled={loading}
                    title="Remove plant"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => openAddDialog(plot.areaId, plot.id, { x, y })}
                className="add-cell-btn"
                disabled={loading}
                title="Plant here"
              >
                <span className="add-icon">🌱</span>
              </button>
            )}
          </div>
        );
      }
      grid.push(
        <div key={y} className="grid-row">
          {row}
        </div>
      );
    }

    return <div className="plot-grid">{grid}</div>;
  };

  const renderPlot = (plot) => (
    <div key={plot.id} className="plot-card">
      <div className="plot-header">
        <div className="plot-info">
          <h4 className="plot-name">🧱 {plot.name}</h4>
          <div className="plot-details">
            {plot.plotType} • {plot.width}×{plot.length} • {plot.soilType}
            {plot.ph && ` • pH ${plot.ph}`}
          </div>
        </div>
        <div className="plot-actions">
          <button 
            onClick={() => handleRemovePlot(plot.id, plot.name)}
            className="remove-btn"
            disabled={loading}
            title="Remove plot"
          >
            ✕
          </button>
        </div>
      </div>
      {renderPlotGrid(plot)}
    </div>
  );

  const renderArea = (area) => {
    const areaPlots = plots.filter((p) => p.areaId === area.id);
    const areaPlants = plants.filter(
      (p) => p.areaId === area.id && !p.plotId
    );

    return (
      <div key={area.id} className="area-card">
        <div className="area-header">
          <div className="area-info">
            <h3 className="area-name">📍 {area.name}</h3>
            <div className="area-details">
              <span className="area-type">{area.locationType}</span>
              <span className="area-brightness">☀️ {area.brightness}</span>
              {area.isGreenhouse && <span className="area-feature greenhouse">🌿 Greenhouse</span>}
              {area.isCovered && !area.isGreenhouse && <span className="area-feature covered">🛡️ Covered</span>}
              {!area.isCovered && !area.isGreenhouse && <span className="area-feature exposed">☀️ Exposed</span>}
            </div>
          </div>
          <div className="area-actions">
            <button 
              onClick={() => openAddPlotDialog(area.id)}
              className="add-btn secondary"
              disabled={loading}
            >
              + Add Plot
            </button>
            <button 
              onClick={() => openAddDialog(area.id)}
              className="add-btn primary"
              disabled={loading}
            >
              + Add Free-standing Plant
            </button>
          </div>
        </div>
        
        <div className="area-content">
          {areaPlots.map(renderPlot)}
          
          {areaPlants.length > 0 && (
            <div className="loose-plants">
              <div className="loose-plants-header">
                <h4>🪴 Free-standing Plants</h4>
                <button 
                  onClick={() => openAddDialog(area.id)}
                  className="add-btn secondary"
                  disabled={loading}
                >
                  + Add Free-standing Plant
                </button>
              </div>
              <div className="plants-grid">
                {areaPlants.map(renderPlant)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">🌱 Pots & Plots</h1>
          <p className="dashboard-subtitle">Manage your plants, plots, and growing areas</p>
        </div>
        {loading && <div className="loading-indicator">Loading...</div>}
      </header>

      <main className="dashboard-content">
        {areas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌿</div>
            <h3>No areas found</h3>
            <p>Create your first growing area to get started</p>
          </div>
        ) : (
          areas.map(renderArea)
        )}
      </main>

      {showAddDialog && (
        <div className="modal-overlay" onClick={() => setShowAddDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🌱 Add New Plant</h3>
              <button 
                onClick={() => setShowAddDialog(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="plant-name">Plant Name</label>
                <input
                  id="plant-name"
                  type="text"
                  value={newPlantName}
                  onChange={(e) => setNewPlantName(e.target.value)}
                  placeholder="Enter plant name..."
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="plant-type">Plant Type</label>
                <select
                  id="plant-type"
                  value={selectedPlantType}
                  onChange={(e) => setSelectedPlantType(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select a type...</option>
                  {plantTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.commonName} ({type.latinName})
                    </option>
                  ))}
                </select>
              </div>

              {addPlantContext?.plotId && (
                <div className="form-group">
                  <label>Plot Position</label>
                  <div className="position-selector">
                    {renderPositionSelector()}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setShowAddDialog(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddPlant}
                className="btn-primary"
                disabled={loading || !newPlantName.trim() || !selectedPlantType || 
                         (addPlantContext?.plotId && !selectedPosition && !addPlantContext.position)}
              >
                {loading ? 'Adding...' : 'Add Plant'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddPlotDialog && (
        <div className="modal-overlay" onClick={() => setShowAddPlotDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🧱 Add New Plot</h3>
              <button 
                onClick={() => setShowAddPlotDialog(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="plot-name">Plot Name</label>
                  <input
                    id="plot-name"
                    type="text"
                    value={newPlotData.name}
                    onChange={(e) => setNewPlotData({...newPlotData, name: e.target.value})}
                    placeholder="Enter plot name..."
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="plot-type">Plot Type</label>
                  <select
                    id="plot-type"
                    value={newPlotData.plotType}
                    onChange={(e) => setNewPlotData({...newPlotData, plotType: e.target.value})}
                    className="form-select"
                  >
                    <option value="raised-bed">Raised Bed</option>
                    <option value="container">Container</option>
                    <option value="ground">Ground Plot</option>
                    <option value="hydroponic">Hydroponic</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="plot-width">Width (m)</label>
                  <input
                    id="plot-width"
                    type="number"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={newPlotData.width}
                    onChange={(e) => setNewPlotData({...newPlotData, width: parseFloat(e.target.value)})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="plot-length">Length (m)</label>
                  <input
                    id="plot-length"
                    type="number"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={newPlotData.length}
                    onChange={(e) => setNewPlotData({...newPlotData, length: parseFloat(e.target.value)})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="soil-type">Soil Type</label>
                  <select
                    id="soil-type"
                    value={newPlotData.soilType}
                    onChange={(e) => setNewPlotData({...newPlotData, soilType: e.target.value})}
                    className="form-select"
                  >
                    <option value="clay">Clay</option>
                    <option value="loam">Loam</option>
                    <option value="sand">Sand</option>
                    <option value="silt">Silt</option>
                    <option value="potting-mix">Potting Mix</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="soil-ph">pH Level</label>
                  <input
                    id="soil-ph"
                    type="number"
                    min="4.0"
                    max="10.0"
                    step="0.1"
                    value={newPlotData.ph}
                    onChange={(e) => setNewPlotData({...newPlotData, ph: parseFloat(e.target.value)})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="drainage-level">Drainage Level</label>
                <select
                  id="drainage-level"
                  value={newPlotData.drainageLevel}
                  onChange={(e) => setNewPlotData({...newPlotData, drainageLevel: e.target.value})}
                  className="form-select"
                >
                  <option value="poor">Poor</option>
                  <option value="fair">Fair</option>
                  <option value="good">Good</option>
                  <option value="excellent">Excellent</option>
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setShowAddPlotDialog(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddPlot}
                className="btn-primary"
                disabled={loading || !newPlotData.name.trim()}
              >
                {loading ? 'Adding...' : 'Add Plot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

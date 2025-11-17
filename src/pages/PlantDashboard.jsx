import React, { useEffect, useState } from 'react';
import {
  getAreas,
  getPlots,
  getPlants,
  getPlantTypes,
  addPlant,
  removePlant,
} from '../api/backendApi';
import './PlantDashboard.css';

export default function PlantDashboard() {
  const [areas, setAreas] = useState([]);
  const [plots, setPlots] = useState([]);
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlantType, setSelectedPlantType] = useState('');
  const [newPlantName, setNewPlantName] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addPlantContext, setAddPlantContext] = useState(null);

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
    setShowAddDialog(true);
    setNewPlantName('');
    setSelectedPlantType('');
  };

  const handleAddPlant = async () => {
    if (!newPlantName.trim() || !selectedPlantType) {
      alert('Please enter a plant name and select a type');
      return;
    }

    setLoading(true);
    try {
      const newPlant = await addPlant({
        name: newPlantName.trim(),
        species_id: parseInt(selectedPlantType),
        area_id: addPlantContext.areaId,
        plot_id: addPlantContext.plotId,
        position: addPlantContext.position
      });
      setPlants([...plants, newPlant]);
      setShowAddDialog(false);
    } catch (error) {
      console.error('Failed to add plant:', error);
      alert('Failed to add plant');
    }
    setLoading(false);
  };

  const renderPlant = (plant) => (
    <div key={plant.id} className="plant-card">
      <div className="plant-info">
        <h4 className="plant-name">{plant.name}</h4>
        <p className="plant-type">{getPlantType(plant.speciesId)}</p>
        {plant.healthStatus && (
          <span className={`health-badge ${plant.healthStatus.toLowerCase()}`}>
            {plant.healthStatus}
          </span>
        )}
        {plant.notes && <p className="plant-notes">{plant.notes}</p>}
      </div>
      <button 
        onClick={() => handleRemovePlant(plant.id, plant.name)}
        className="remove-btn"
        disabled={loading}
        title="Remove plant"
      >
        🗑️
      </button>
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
              <div className="grid-plant">
                <div className="grid-plant-info">
                  <div className="grid-plant-name">{plant.name}</div>
                  <div className="grid-plant-type">{getPlantType(plant.speciesId)}</div>
                </div>
                <button 
                  onClick={() => handleRemovePlant(plant.id, plant.name)}
                  className="grid-remove-btn"
                  disabled={loading}
                  title="Remove plant"
                >
                  ✕
                </button>
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
        <button 
          onClick={() => openAddDialog(plot.areaId, plot.id)}
          className="add-btn secondary"
          disabled={loading}
        >
          + Add Plant
        </button>
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
          <button 
            onClick={() => openAddDialog(area.id)}
            className="add-btn primary"
            disabled={loading}
          >
            + Add Plant
          </button>
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
                  + Add Plant
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
                disabled={loading || !newPlantName.trim() || !selectedPlantType}
              >
                {loading ? 'Adding...' : 'Add Plant'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

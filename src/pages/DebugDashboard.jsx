import React, { useEffect, useState } from 'react';
import {
  getAreas,
  getPlots,
  getPlants,
  getPlantTypes,
  addPlant,
  removePlant,
} from '../api/backendApi';

export default function DebugDashboard() {
  const [areas, setAreas] = useState([]);
  const [plots, setPlots] = useState([]);
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
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
    }
    loadData();
  }, []);

  const getPlantType = (id) =>
    plantTypes.find((pt) => pt.id === id)?.commonName || 'Unknown';

  const handleRemovePlant = async (plantId) => {
    if (!window.confirm('Are you sure you want to remove this plant?')) return;
    
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

  const handleAddPlant = async (areaId, plotId = null, position = null) => {
    const plantName = prompt('Enter plant name:');
    if (!plantName) return;

    // Get available plant types for selection
    const selectedTypeIndex = prompt(
      `Select plant type (0-${plantTypes.length - 1}):\n` +
      plantTypes.map((pt, i) => `${i}: ${pt.commonName}`).join('\n')
    );
    
    if (selectedTypeIndex === null || selectedTypeIndex === '') return;
    
    const typeIndex = parseInt(selectedTypeIndex);
    if (typeIndex < 0 || typeIndex >= plantTypes.length) {
      alert('Invalid plant type selection');
      return;
    }

    const selectedType = plantTypes[typeIndex];
    
    setLoading(true);
    try {
      const newPlant = await addPlant({
        name: plantName,
        species_id: selectedType.id,
        area_id: areaId,
        plot_id: plotId,
        position: position
      });
      setPlants([...plants, newPlant]);
    } catch (error) {
      console.error('Failed to add plant:', error);
      alert('Failed to add plant');
    }
    setLoading(false);
  };

  const renderPlant = (plant) => (
    <div key={plant.id} style={styles.boxInner}>
      <div style={styles.plantContent}>
        <div>
          <strong>{plant.name}</strong> — <em>{getPlantType(plant.speciesId)}</em>
          {plant.notes && <p><small>{plant.notes}</small></p>}
        </div>
        <button 
          onClick={() => handleRemovePlant(plant.id)} 
          style={styles.removeButton}
          disabled={loading}
        >
          ❌
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
          <div key={key} style={styles.gridCell}>
            {plant ? (
              <div style={styles.gridPlantContent}>
                <div style={styles.gridPlantInfo}>
                  <strong>{plant.name}</strong>
                  <div style={{ fontSize: '0.8em', color: '#555' }}>
                    {getPlantType(plant.speciesId)}
                  </div>
                </div>
                <button 
                  onClick={() => handleRemovePlant(plant.id)} 
                  style={styles.gridRemoveButton}
                  disabled={loading}
                  title="Remove plant"
                >
                  ❌
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleAddPlant(plot.areaId, plot.id, { x, y })} 
                style={styles.addButton}
                disabled={loading}
                title="Add plant here"
              >
                ➕
              </button>
            )}
          </div>
        );
      }
      grid.push(
        <div key={y} style={styles.gridRow}>
          {row}
        </div>
      );
    }

    return (
      <div style={styles.gridWrapper}>{grid}</div>
    );
  };

  const renderPlot = (plot) => (
    <div key={plot.id} style={styles.box}>
      <div style={styles.plotHeader}>
        <div style={styles.plotMeta}>
          🧱 {plot.name} — {plot.plotType} ({plot.width}×{plot.length})
        </div>
        <button 
          onClick={() => handleAddPlant(plot.areaId, plot.id)} 
          style={styles.addPlantButton}
          disabled={loading}
          title="Add plant to this plot"
        >
          ➕ Add Plant
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
      <div key={area.id} style={styles.box}>
        <div style={styles.areaHeader}>
          <div>
            <h3>📍 Area: {area.name}</h3>
            <p>
              {area.locationType} • brightness: {area.brightness} •{' '}
              {area.isGreenhouse ? '🌿 Greenhouse' : area.isCovered ? '🛡 Covered' : '☀️ Exposed'}
            </p>
          </div>
          <button 
            onClick={() => handleAddPlant(area.id)} 
            style={styles.addPlantButton}
            disabled={loading}
            title="Add plant to this area"
          >
            ➕ Add Plant
          </button>
        </div>
        {areaPlots.map(renderPlot)}
        {areaPlants.length > 0 && (
          <div style={styles.box}>
            <div style={styles.loosePlantsHeader}>
              <h4>🪴 Loose Plants:</h4>
              <button 
                onClick={() => handleAddPlant(area.id)} 
                style={styles.addPlantButton}
                disabled={loading}
                title="Add loose plant to this area"
              >
                ➕ Add Plant
              </button>
            </div>
            {areaPlants.map(renderPlant)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>🌱 Debug Dashboard</h2>
      {areas.map(renderArea)}
    </div>
  );
}

const styles = {
  box: {
    border: '2px solid #ccc',
    borderRadius: '8px',
    padding: '0.75rem',
    margin: '1rem 0',
    backgroundColor: '#f8f8f8',
  },
  boxInner: {
    border: '1px dashed #aaa',
    borderRadius: '4px',
    padding: '0.5rem',
    margin: '0.5rem 0',
    backgroundColor: '#fff',
  },
  plotMeta: {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  gridWrapper: {
    display: 'inline-block',
    border: '1px solid #999',
  },
  gridRow: {
    display: 'flex',
  },
  gridCell: {
    width: 100,
    height: 80,
    border: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '0.5rem',
    boxSizing: 'border-box',
    position: 'relative',
  },
  areaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  plotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  loosePlantsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  plantContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  gridPlantContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  gridPlantInfo: {
    textAlign: 'center',
    marginBottom: '0.25rem',
  },
  addPlantButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  addButton: {
    backgroundColor: '#e8f5e8',
    color: '#4CAF50',
    border: '2px dashed #4CAF50',
    borderRadius: '4px',
    padding: '0.5rem',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#ff4444',
    padding: '0.25rem',
  },
  gridRemoveButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#ff4444',
    padding: '0.25rem',
    position: 'absolute',
    top: '2px',
    right: '2px',
  },
};

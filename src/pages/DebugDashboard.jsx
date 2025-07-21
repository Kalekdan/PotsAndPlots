import React, { useEffect, useState } from 'react';
import {
  getAreas,
  getPlots,
  getPlants,
  getPlantTypes,
} from '../api/mockApi';

export default function DebugDashboard() {
  const [areas, setAreas] = useState([]);
  const [plots, setPlots] = useState([]);
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantTypes] = useState([]);

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
    plantTypes.find((pt) => pt.id === id)?.common_name || 'Unknown';

  const renderPlant = (plant) => (
    <div key={plant.id} style={styles.boxInner}>
      <strong>{plant.name}</strong> — <em>{getPlantType(plant.species_id)}</em>
      {plant.notes && <p><small>{plant.notes}</small></p>}
    </div>
  );

  const renderPlotGrid = (plot) => {
    const grid = [];
    const plotPlants = plants.filter((p) => p.plot_id === plot.id);

    // Create lookup by x/y for quick fill
    const plantMap = {};
    plotPlants.forEach((p) => {
      if (p.position) {
        plantMap[`${p.position.x},${p.position.y}`] = p;
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
              <div>
                <strong>{plant.name}</strong>
                <div style={{ fontSize: '0.8em', color: '#555' }}>
                  {getPlantType(plant.species_id)}
                </div>
              </div>
            ) : (
              <span style={{ color: '#ccc' }}>—</span>
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
      <div>
        <div style={styles.plotMeta}>
          🧱 {plot.name} — {plot.plot_type} ({plot.width}×{plot.length})
        </div>
        <div style={styles.gridWrapper}>{grid}</div>
      </div>
    );
  };

  const renderPlot = (plot) => (
    <div key={plot.id} style={styles.box}>
      {renderPlotGrid(plot)}
    </div>
  );

  const renderArea = (area) => {
    const areaPlots = plots.filter((p) => p.area_id === area.id);
    const areaPlants = plants.filter(
      (p) => p.area_id === area.id && !p.plot_id
    );
    return (
      <div key={area.id} style={styles.box}>
        <h3>📍 Area: {area.name}</h3>
        <p>
          {area.location_type} • brightness: {area.brightness} •{' '}
          {area.is_greenhouse ? '🌿 Greenhouse' : area.is_covered ? '🛡 Covered' : '☀️ Exposed'}
        </p>
        {areaPlots.map(renderPlot)}
        {areaPlants.length > 0 && (
          <div style={styles.box}>
            <h4>🪴 Loose Plants:</h4>
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
  },
};

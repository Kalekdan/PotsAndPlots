import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPlant,
  updatePlant,
  getPlantTypes,
  getAreas,
  getPlots
} from '../api/backendApi';
import './PlantDetails.css';

export default function PlantDetails() {
  const { plantId } = useParams();
  const navigate = useNavigate();
  
  const [plant, setPlant] = useState(null);
  const [plantTypes, setPlantTypes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [plots, setPlots] = useState([]);
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

  useEffect(() => {
    loadData();
  }, [plantId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [plantData, plantTypesData, areasData, plotsData] = await Promise.all([
        getPlant(plantId),
        getPlantTypes(),
        getAreas(),
        getPlots()
      ]);
      
      if (!plantData) {
        setError('Plant not found');
        return;
      }
      
      setPlant(plantData);
      setPlantTypes(plantTypesData);
      setAreas(areasData);
      setPlots(plotsData);
      
      setFormData({
        name: plantData.name || '',
        speciesId: plantData.speciesId || '',
        healthStatus: plantData.healthStatus || 'healthy',
        notes: plantData.notes || '',
        wateringSchedule: plantData.wateringSchedule || 'weekly',
        plantedDate: plantData.plantedDate || ''
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
    </div>
  );
}

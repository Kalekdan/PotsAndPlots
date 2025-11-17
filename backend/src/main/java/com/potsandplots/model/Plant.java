package com.potsandplots.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "plants")
public class Plant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String name;
    
    @NotNull
    @Column(name = "species_id", nullable = false)
    private Long speciesId;
    
    @NotNull
    @Column(name = "area_id", nullable = false)
    private Long areaId;
    
    @Column(name = "plot_id")
    private Long plotId;
    
    @Column(name = "position_x")
    private Integer positionX;
    
    @Column(name = "position_y")
    private Integer positionY;
    
    @Column(name = "planted_date")
    private LocalDate plantedDate;
    
    @Column(name = "health_status")
    private String healthStatus;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "watering_schedule")
    private String wateringSchedule;
    
    // Constructors
    public Plant() {}
    
    public Plant(String name, Long speciesId, Long areaId) {
        this.name = name;
        this.speciesId = speciesId;
        this.areaId = areaId;
        this.plantedDate = LocalDate.now();
        this.healthStatus = "healthy";
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Long getSpeciesId() { return speciesId; }
    public void setSpeciesId(Long speciesId) { this.speciesId = speciesId; }
    
    public Long getAreaId() { return areaId; }
    public void setAreaId(Long areaId) { this.areaId = areaId; }
    
    public Long getPlotId() { return plotId; }
    public void setPlotId(Long plotId) { this.plotId = plotId; }
    
    public Integer getPositionX() { return positionX; }
    public void setPositionX(Integer positionX) { this.positionX = positionX; }
    
    public Integer getPositionY() { return positionY; }
    public void setPositionY(Integer positionY) { this.positionY = positionY; }
    
    public LocalDate getPlantedDate() { return plantedDate; }
    public void setPlantedDate(LocalDate plantedDate) { this.plantedDate = plantedDate; }
    
    public String getHealthStatus() { return healthStatus; }
    public void setHealthStatus(String healthStatus) { this.healthStatus = healthStatus; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getWateringSchedule() { return wateringSchedule; }
    public void setWateringSchedule(String wateringSchedule) { this.wateringSchedule = wateringSchedule; }
}

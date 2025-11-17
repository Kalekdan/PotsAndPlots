package com.potsandplots.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "plots")
public class Plot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String name;
    
    @NotNull
    @Column(name = "area_id", nullable = false)
    private Long areaId;
    
    @NotBlank
    @Column(name = "plot_type", nullable = false)
    private String plotType;
    
    @Positive
    @Column(nullable = false)
    private Integer width;
    
    @Positive
    @Column(nullable = false)
    private Integer length;
    
    @Column(name = "soil_type")
    private String soilType;
    
    @Column(name = "drainage_level")
    private String drainageLevel;
    
    @Column(name = "ph")
    private Double ph;
    
    // Constructors
    public Plot() {}
    
    public Plot(String name, Long areaId, String plotType, Integer width, Integer length) {
        this.name = name;
        this.areaId = areaId;
        this.plotType = plotType;
        this.width = width;
        this.length = length;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Long getAreaId() { return areaId; }
    public void setAreaId(Long areaId) { this.areaId = areaId; }
    
    public String getPlotType() { return plotType; }
    public void setPlotType(String plotType) { this.plotType = plotType; }
    
    public Integer getWidth() { return width; }
    public void setWidth(Integer width) { this.width = width; }
    
    public Integer getLength() { return length; }
    public void setLength(Integer length) { this.length = length; }
    
    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }
    
    public String getDrainageLevel() { return drainageLevel; }
    public void setDrainageLevel(String drainageLevel) { this.drainageLevel = drainageLevel; }
    
    public Double getPh() { return ph; }
    public void setPh(Double ph) { this.ph = ph; }
}

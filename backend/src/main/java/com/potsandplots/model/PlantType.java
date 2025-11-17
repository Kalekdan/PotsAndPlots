package com.potsandplots.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "plant_types")
public class PlantType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(name = "common_name", nullable = false)
    private String commonName;
    
    @Column(name = "latin_name")
    private String latinName;
    
    @Column(name = "light_requirements")
    private String lightRequirements;
    
    @Column(name = "water_requirements")
    private String waterRequirements;
    
    @Column(name = "soil_requirements")
    private String soilRequirements;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @NotNull
    @Column(name = "is_edible", nullable = false)
    private Boolean isEdible;
    
    // Constructors
    public PlantType() {}
    
    public PlantType(String commonName, String latinName, Boolean isEdible) {
        this.commonName = commonName;
        this.latinName = latinName;
        this.isEdible = isEdible;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCommonName() { return commonName; }
    public void setCommonName(String commonName) { this.commonName = commonName; }
    
    public String getLatinName() { return latinName; }
    public void setLatinName(String latinName) { this.latinName = latinName; }
    
    public String getLightRequirements() { return lightRequirements; }
    public void setLightRequirements(String lightRequirements) { this.lightRequirements = lightRequirements; }
    
    public String getWaterRequirements() { return waterRequirements; }
    public void setWaterRequirements(String waterRequirements) { this.waterRequirements = waterRequirements; }
    
    public String getSoilRequirements() { return soilRequirements; }
    public void setSoilRequirements(String soilRequirements) { this.soilRequirements = soilRequirements; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public Boolean getIsEdible() { return isEdible; }
    public void setIsEdible(Boolean isEdible) { this.isEdible = isEdible; }
}

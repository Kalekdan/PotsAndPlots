package com.potsandplots.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "areas")
public class Area {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String name;
    
    @NotBlank
    @Column(name = "location_type", nullable = false)
    private String locationType;
    
    @NotNull
    @Column(name = "is_covered", nullable = false)
    private Boolean isCovered;
    
    @NotNull
    @Column(name = "is_greenhouse", nullable = false)
    private Boolean isGreenhouse;
    
    @NotBlank
    @Column(nullable = false)
    private String brightness;
    
    // Constructors
    public Area() {}
    
    public Area(String name, String locationType, Boolean isCovered, Boolean isGreenhouse, String brightness) {
        this.name = name;
        this.locationType = locationType;
        this.isCovered = isCovered;
        this.isGreenhouse = isGreenhouse;
        this.brightness = brightness;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getLocationType() { return locationType; }
    public void setLocationType(String locationType) { this.locationType = locationType; }
    
    public Boolean getIsCovered() { return isCovered; }
    public void setIsCovered(Boolean isCovered) { this.isCovered = isCovered; }
    
    public Boolean getIsGreenhouse() { return isGreenhouse; }
    public void setIsGreenhouse(Boolean isGreenhouse) { this.isGreenhouse = isGreenhouse; }
    
    public String getBrightness() { return brightness; }
    public void setBrightness(String brightness) { this.brightness = brightness; }
}

package com.potsandplots.controller;

import com.potsandplots.dto.PlantCreateRequest;
import com.potsandplots.model.Plant;
import com.potsandplots.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/plants")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class PlantController {
    
    @Autowired
    private PlantRepository plantRepository;
    
    @GetMapping
    public List<Plant> getAllPlants() {
        return plantRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public Plant getPlant(@PathVariable Long id) {
        return plantRepository.findById(id).orElse(null);
    }
    
    @GetMapping("/area/{areaId}")
    public List<Plant> getPlantsByArea(@PathVariable Long areaId) {
        return plantRepository.findByAreaId(areaId);
    }
    
    @GetMapping("/plot/{plotId}")
    public List<Plant> getPlantsByPlot(@PathVariable Long plotId) {
        return plantRepository.findByPlotId(plotId);
    }
    
    @PostMapping
    public Plant createPlant(@RequestBody PlantCreateRequest request) {
        Plant plant = new Plant(request.getName(), request.getSpeciesId(), request.getAreaId());
        plant.setPlotId(request.getPlotId());
        plant.setPositionX(request.getPositionX());
        plant.setPositionY(request.getPositionY());
        plant.setNotes(request.getNotes());
        plant.setWateringSchedule("weekly");
        return plantRepository.save(plant);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Plant> updatePlant(@PathVariable Long id, @RequestBody Plant plantUpdate) {
        try {
            System.out.println("Updating plant with ID: " + id);
            System.out.println("Plant update data: " + plantUpdate.getName());
            
            return plantRepository.findById(id)
                .map(plant -> {
                    if (plantUpdate.getName() != null && !plantUpdate.getName().trim().isEmpty()) {
                        plant.setName(plantUpdate.getName());
                    }
                    if (plantUpdate.getSpeciesId() != null) {
                        plant.setSpeciesId(plantUpdate.getSpeciesId());
                    }
                    if (plantUpdate.getHealthStatus() != null) {
                        plant.setHealthStatus(plantUpdate.getHealthStatus());
                    }
                    if (plantUpdate.getNotes() != null) {
                        plant.setNotes(plantUpdate.getNotes());
                    }
                    if (plantUpdate.getWateringSchedule() != null) {
                        plant.setWateringSchedule(plantUpdate.getWateringSchedule());
                    }
                    if (plantUpdate.getPlantedDate() != null) {
                        plant.setPlantedDate(plantUpdate.getPlantedDate());
                    }
                    // Note: Not updating area, plot, or position as those require more complex logic
                    Plant savedPlant = plantRepository.save(plant);
                    System.out.println("Plant updated successfully: " + savedPlant.getName());
                    return ResponseEntity.ok(savedPlant);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error updating plant: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePlant(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (plantRepository.existsById(id)) {
                plantRepository.deleteById(id);
                response.put("success", true);
                response.put("plantId", id);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Plant not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}

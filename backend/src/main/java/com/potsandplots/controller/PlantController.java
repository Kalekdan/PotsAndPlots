package com.potsandplots.controller;

import com.potsandplots.dto.PlantCreateRequest;
import com.potsandplots.model.Plant;
import com.potsandplots.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.HashMap;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;

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
        // Validate position conflicts if plant has specific coordinates
        if (request.getPositionX() != null && request.getPositionY() != null) {
            List<Plant> existingPlants = plantRepository.findByAreaIdAndPositionXAndPositionY(
                    request.getAreaId(), request.getPositionX(), request.getPositionY());
            
            if (!existingPlants.isEmpty()) {
                throw new RuntimeException("Position (" + request.getPositionX() + ", " + request.getPositionY() + 
                                         ") is already occupied by another plant in this area");
            }
        }
        
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
                    
                    // Handle position updates with conflict checking
                    if (plantUpdate.getPositionX() != null && plantUpdate.getPositionY() != null) {
                        List<Plant> existingPlants = plantRepository.findByAreaIdAndPositionXAndPositionY(
                                plant.getAreaId(), plantUpdate.getPositionX(), plantUpdate.getPositionY());
                        
                        // Check if any other plant occupies this position
                        boolean positionOccupied = existingPlants.stream()
                                .anyMatch(p -> !Objects.equals(p.getId(), plant.getId()));
                        
                        if (positionOccupied) {
                            throw new RuntimeException("Position (" + plantUpdate.getPositionX() + ", " + 
                                                     plantUpdate.getPositionY() + ") is already occupied");
                        }
                        
                        plant.setPositionX(plantUpdate.getPositionX());
                        plant.setPositionY(plantUpdate.getPositionY());
                    }
                    
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

    @PutMapping("/{id}/move")
    public ResponseEntity<Plant> movePlant(@PathVariable Long id, @RequestBody Map<String, Object> moveData) {
        try {
            return plantRepository.findById(id)
                .map(plant -> {
                    // Update area if provided
                    if (moveData.containsKey("areaId")) {
                        Long newAreaId = Long.valueOf(moveData.get("areaId").toString());
                        plant.setAreaId(newAreaId);
                    }
                    
                    // Update plot if provided (can be null for free-standing plants)
                    if (moveData.containsKey("plotId")) {
                        Object plotIdValue = moveData.get("plotId");
                        if (plotIdValue == null || "null".equals(plotIdValue.toString())) {
                            plant.setPlotId(null);
                            plant.setPositionX(null);
                            plant.setPositionY(null);
                        } else {
                            Long newPlotId = Long.valueOf(plotIdValue.toString());
                            
                            // Update position if provided and validate conflicts
                            if (moveData.containsKey("positionX") && moveData.containsKey("positionY")) {
                                Integer newPositionX = Integer.valueOf(moveData.get("positionX").toString());
                                Integer newPositionY = Integer.valueOf(moveData.get("positionY").toString());
                                
                                // Check for position conflicts (excluding the current plant)
                                List<Plant> existingPlantsInPlot = plantRepository.findByPlotId(newPlotId);
                                boolean positionOccupied = existingPlantsInPlot.stream()
                                    .filter(p -> !Objects.equals(p.getId(), plant.getId())) // Exclude current plant
                                    .anyMatch(p -> Objects.equals(p.getPositionX(), newPositionX) && 
                                                 Objects.equals(p.getPositionY(), newPositionY));
                                
                                if (positionOccupied) {
                                    throw new RuntimeException("Position (" + newPositionX + ", " + newPositionY + 
                                                             ") is already occupied by another plant in this plot");
                                }
                                
                                plant.setPositionX(newPositionX);
                                plant.setPositionY(newPositionY);
                            }
                            
                            plant.setPlotId(newPlotId);
                        }
                    }
                    
                    Plant savedPlant = plantRepository.save(plant);
                    System.out.println("Plant moved successfully: " + savedPlant.getName());
                    return ResponseEntity.ok(savedPlant);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error moving plant: " + e.getMessage());
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

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}

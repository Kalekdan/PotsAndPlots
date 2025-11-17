package com.potsandplots.controller;

import com.potsandplots.model.PlantType;
import com.potsandplots.repository.PlantTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plant-types")
@CrossOrigin(origins = "http://localhost:3000")
public class PlantTypeController {
    
    @Autowired
    private PlantTypeRepository plantTypeRepository;
    
    @GetMapping
    public List<PlantType> getAllPlantTypes() {
        return plantTypeRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public PlantType getPlantType(@PathVariable Long id) {
        return plantTypeRepository.findById(id).orElse(null);
    }
    
    @PostMapping
    public PlantType createPlantType(@RequestBody PlantType plantType) {
        return plantTypeRepository.save(plantType);
    }
}

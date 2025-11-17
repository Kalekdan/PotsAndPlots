package com.potsandplots.controller;

import com.potsandplots.model.Area;
import com.potsandplots.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin(origins = "http://localhost:3000")
public class AreaController {
    
    @Autowired
    private AreaRepository areaRepository;
    
    @GetMapping
    public List<Area> getAllAreas() {
        return areaRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public Area getArea(@PathVariable Long id) {
        return areaRepository.findById(id).orElse(null);
    }
    
    @PostMapping
    public Area createArea(@RequestBody Area area) {
        return areaRepository.save(area);
    }
}

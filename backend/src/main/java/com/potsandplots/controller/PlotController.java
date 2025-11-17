package com.potsandplots.controller;

import com.potsandplots.model.Plot;
import com.potsandplots.repository.PlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plots")
@CrossOrigin(origins = "http://localhost:3000")
public class PlotController {
    
    @Autowired
    private PlotRepository plotRepository;
    
    @GetMapping
    public List<Plot> getAllPlots() {
        return plotRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public Plot getPlot(@PathVariable Long id) {
        return plotRepository.findById(id).orElse(null);
    }
    
    @GetMapping("/area/{areaId}")
    public List<Plot> getPlotsByArea(@PathVariable Long areaId) {
        return plotRepository.findByAreaId(areaId);
    }
    
    @PostMapping
    public Plot createPlot(@RequestBody Plot plot) {
        return plotRepository.save(plot);
    }
}

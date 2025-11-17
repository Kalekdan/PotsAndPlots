package com.potsandplots.controller;

import com.potsandplots.model.Plot;
import com.potsandplots.repository.PlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plots")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
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
    
    @PutMapping("/{id}")
    public Plot updatePlot(@PathVariable Long id, @RequestBody Plot plotUpdate) {
        return plotRepository.findById(id)
            .map(plot -> {
                plot.setName(plotUpdate.getName());
                plot.setPlotType(plotUpdate.getPlotType());
                plot.setLength(plotUpdate.getLength());
                plot.setWidth(plotUpdate.getWidth());
                plot.setSoilType(plotUpdate.getSoilType());
                plot.setPh(plotUpdate.getPh());
                plot.setDrainageLevel(plotUpdate.getDrainageLevel());
                return plotRepository.save(plot);
            })
            .orElse(null);
    }
    
    @DeleteMapping("/{id}")
    public void deletePlot(@PathVariable Long id) {
        plotRepository.deleteById(id);
    }
}

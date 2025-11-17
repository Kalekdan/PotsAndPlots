package com.potsandplots.controller;

import com.potsandplots.model.Plot;
import com.potsandplots.model.Plant;
import com.potsandplots.repository.PlotRepository;
import com.potsandplots.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plots")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class PlotController {
    
    @Autowired
    private PlotRepository plotRepository;
    
    @Autowired
    private PlantRepository plantRepository;
    
    @GetMapping
    public List<Plot> getAllPlots() {
        return plotRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Plot> getPlot(@PathVariable Long id) {
        return plotRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
    public ResponseEntity<Map<String, Object>> deletePlot(@PathVariable Long id) {
        try {
            // Check if plot exists
            if (!plotRepository.existsById(id)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Plot not found");
                return ResponseEntity.notFound().build();
            }
            
            // Find all plants in this plot and make them free-standing
            List<Plant> plantsInPlot = plantRepository.findByPlotId(id);
            for (Plant plant : plantsInPlot) {
                plant.setPlotId(null);
                plant.setPositionX(null);
                plant.setPositionY(null);
                plantRepository.save(plant);
                System.out.println("Plant " + plant.getName() + " converted to free-standing");
            }
            
            // Delete the plot
            plotRepository.deleteById(id);
            
            System.out.println("Plot deleted successfully. " + plantsInPlot.size() + " plants converted to free-standing.");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Plot deleted successfully");
            response.put("plantsConverted", plantsInPlot.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error deleting plot: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete plot: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}

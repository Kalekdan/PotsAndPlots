package com.potsandplots;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PlantManagementIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCompleteWorkflow() throws Exception {
        // 1. Get initial data (should have sample data from DataInitializer)
        mockMvc.perform(get("/api/areas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        mockMvc.perform(get("/api/plots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        mockMvc.perform(get("/api/plants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        // 2. Create a new plot
        Map<String, Object> plotData = new HashMap<>();
        plotData.put("name", "Test Plot");
        plotData.put("areaId", 1);
        plotData.put("plotType", "raised-bed");
        plotData.put("width", 3);
        plotData.put("length", 2);
        plotData.put("soilType", "loam");
        plotData.put("ph", 6.5);
        plotData.put("drainageLevel", "good");

        String plotResponse = mockMvc.perform(post("/api/plots")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(plotData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Plot"))
                .andReturn().getResponse().getContentAsString();

        Map<String, Object> createdPlot = objectMapper.readValue(plotResponse, Map.class);
        Long plotId = Long.valueOf(createdPlot.get("id").toString());

        // 3. Create a plant in the plot
        Map<String, Object> plantData = new HashMap<>();
        plantData.put("name", "Test Tomato");
        plantData.put("speciesId", 1);
        plantData.put("areaId", 1);
        plantData.put("plotId", plotId);
        plantData.put("positionX", 0);
        plantData.put("positionY", 0);

        String plantResponse = mockMvc.perform(post("/api/plants")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(plantData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Tomato"))
                .andExpect(jsonPath("$.positionX").value(0))
                .andExpect(jsonPath("$.positionY").value(0))
                .andReturn().getResponse().getContentAsString();

        Map<String, Object> createdPlant = objectMapper.readValue(plantResponse, Map.class);
        Long plantId = Long.valueOf(createdPlant.get("id").toString());

        // 4. Try to create another plant at the same position (should fail)
        Map<String, Object> conflictingPlant = new HashMap<>();
        conflictingPlant.put("name", "Conflicting Plant");
        conflictingPlant.put("speciesId", 1);
        conflictingPlant.put("areaId", 1);
        conflictingPlant.put("plotId", plotId);
        conflictingPlant.put("positionX", 0);
        conflictingPlant.put("positionY", 0);

        mockMvc.perform(post("/api/plants")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(conflictingPlant)))
                .andExpect(status().isBadRequest());

        // 5. Move plant to different position
        Map<String, Object> moveData = new HashMap<>();
        moveData.put("areaId", 1);
        moveData.put("plotId", plotId);
        moveData.put("positionX", 1);
        moveData.put("positionY", 0);

        mockMvc.perform(put("/api/plants/" + plantId + "/move")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(moveData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.positionX").value(1))
                .andExpect(jsonPath("$.positionY").value(0));

        // 6. Move plant to free-standing (no plot)
        Map<String, Object> freeStandingMove = new HashMap<>();
        freeStandingMove.put("areaId", 1);
        freeStandingMove.put("plotId", null);

        mockMvc.perform(put("/api/plants/" + plantId + "/move")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(freeStandingMove)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plotId").value((Object) null))
                .andExpect(jsonPath("$.positionX").value((Object) null))
                .andExpect(jsonPath("$.positionY").value((Object) null));

        // 7. Delete the plot (should succeed since no plants in it)
        mockMvc.perform(delete("/api/plots/" + plotId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.plantsConverted").value(0));

        // 8. Verify plot is deleted
        mockMvc.perform(get("/api/plots/" + plotId))
                .andExpect(status().isNotFound());

        // 9. Delete the plant
        mockMvc.perform(delete("/api/plants/" + plantId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    public void testPlotDeletionWithPlants() throws Exception {
        // Create plot with plant, then delete plot to test plant conversion
        Map<String, Object> plotData = new HashMap<>();
        plotData.put("name", "Plot To Delete");
        plotData.put("areaId", 1);
        plotData.put("plotType", "container");
        plotData.put("width", 2);
        plotData.put("length", 1);

        String plotResponse = mockMvc.perform(post("/api/plots")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(plotData)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Map<String, Object> plot = objectMapper.readValue(plotResponse, Map.class);
        Long plotId = Long.valueOf(plot.get("id").toString());

        // Add plant to plot
        Map<String, Object> plantData = new HashMap<>();
        plantData.put("name", "Plant To Convert");
        plantData.put("speciesId", 1);
        plantData.put("areaId", 1);
        plantData.put("plotId", plotId);
        plantData.put("positionX", 0);
        plantData.put("positionY", 0);

        mockMvc.perform(post("/api/plants")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(plantData)))
                .andExpect(status().isOk());

        // Delete plot
        mockMvc.perform(delete("/api/plots/" + plotId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.plantsConverted").value(1));

        // Verify plant is now free-standing
        mockMvc.perform(get("/api/plants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.name=='Plant To Convert')].plotId").value((Object) null));
    }
}

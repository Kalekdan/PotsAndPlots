package com.potsandplots.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.potsandplots.model.Plant;
import com.potsandplots.repository.PlantRepository;
import com.potsandplots.repository.PlantTypeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import java.util.*;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PlantController.class)
@ActiveProfiles("test")
public class PlantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlantRepository plantRepository;

    @MockBean
    private PlantTypeRepository plantTypeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllPlants() throws Exception {
        Plant plant1 = new Plant("Rose", 1L, 1L);
        plant1.setId(1L);
        Plant plant2 = new Plant("Tulip", 2L, 1L);
        plant2.setId(2L);
        List<Plant> plants = Arrays.asList(plant1, plant2);

        when(plantRepository.findAll()).thenReturn(plants);

        mockMvc.perform(get("/api/plants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Rose"))
                .andExpect(jsonPath("$[1].name").value("Tulip"));
    }

    @Test
    public void testCreatePlantWithPositionConflict() throws Exception {
        Plant existingPlant = new Plant("Rose", 1L, 1L);
        existingPlant.setPositionX(5);
        existingPlant.setPositionY(5);
        
        when(plantRepository.findByAreaIdAndPositionXAndPositionY(1L, 5, 5))
                .thenReturn(Arrays.asList(existingPlant));

        Map<String, Object> plantData = new HashMap<>();
        plantData.put("name", "Tulip");
        plantData.put("speciesId", 2L);
        plantData.put("areaId", 1L);
        plantData.put("positionX", 5);
        plantData.put("positionY", 5);

        mockMvc.perform(post("/api/plants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(plantData)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testDeletePlant() throws Exception {
        when(plantRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/plants/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.plantId").value(1));

        verify(plantRepository).deleteById(1L);
    }
}

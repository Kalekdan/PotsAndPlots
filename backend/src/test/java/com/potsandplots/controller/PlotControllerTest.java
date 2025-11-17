package com.potsandplots.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.potsandplots.model.Plot;
import com.potsandplots.model.Plant;
import com.potsandplots.repository.PlotRepository;
import com.potsandplots.repository.PlantRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.test.context.ActiveProfiles;

@WebMvcTest(PlotController.class)
@ActiveProfiles("test")
public class PlotControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlotRepository plotRepository;

    @MockBean
    private PlantRepository plantRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllPlots() throws Exception {
        Plot plot = new Plot();
        plot.setId(1L);
        plot.setName("Test Plot");
        plot.setAreaId(1L);
        plot.setWidth(3);
        plot.setLength(2);

        when(plotRepository.findAll()).thenReturn(Arrays.asList(plot));

        mockMvc.perform(get("/api/plots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Plot"))
                .andExpect(jsonPath("$[0].width").value(3))
                .andExpect(jsonPath("$[0].length").value(2));
    }

    @Test
    public void testCreatePlot() throws Exception {
        Plot plot = new Plot();
        plot.setId(1L);
        plot.setName("New Plot");
        plot.setAreaId(1L);
        plot.setPlotType("raised-bed");
        plot.setWidth(3);
        plot.setLength(2);

        when(plotRepository.save(any(Plot.class))).thenReturn(plot);

        mockMvc.perform(post("/api/plots")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(plot)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Plot"))
                .andExpect(jsonPath("$.plotType").value("raised-bed"));
    }

    @Test
    public void testDeleteEmptyPlot() throws Exception {
        when(plotRepository.existsById(1L)).thenReturn(true);
        when(plantRepository.findByPlotId(1L)).thenReturn(new ArrayList<>());

        mockMvc.perform(delete("/api/plots/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.plantsConverted").value(0));

        verify(plotRepository).deleteById(1L);
    }

    @Test
    public void testDeletePlotWithPlants() throws Exception {
        Plant plant1 = new Plant();
        plant1.setId(1L);
        plant1.setName("Plant 1");
        plant1.setPlotId(1L);
        plant1.setPositionX(0);
        plant1.setPositionY(0);

        Plant plant2 = new Plant();
        plant2.setId(2L);
        plant2.setName("Plant 2");
        plant2.setPlotId(1L);
        plant2.setPositionX(1);
        plant2.setPositionY(0);

        when(plotRepository.existsById(1L)).thenReturn(true);
        when(plantRepository.findByPlotId(1L)).thenReturn(Arrays.asList(plant1, plant2));
        when(plantRepository.save(any(Plant.class))).thenReturn(plant1);

        mockMvc.perform(delete("/api/plots/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.plantsConverted").value(2));

        verify(plantRepository, times(2)).save(any(Plant.class));
        verify(plotRepository).deleteById(1L);
    }

    @Test
    public void testDeleteNonExistentPlot() throws Exception {
        when(plotRepository.existsById(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/plots/1"))
                .andExpect(status().isNotFound());

        verify(plotRepository, never()).deleteById(1L);
    }

    @Test
    public void testGetPlotsByArea() throws Exception {
        Plot plot1 = new Plot();
        plot1.setId(1L);
        plot1.setName("Plot 1");
        plot1.setAreaId(1L);

        Plot plot2 = new Plot();
        plot2.setId(2L);
        plot2.setName("Plot 2");
        plot2.setAreaId(1L);

        when(plotRepository.findByAreaId(1L)).thenReturn(Arrays.asList(plot1, plot2));

        mockMvc.perform(get("/api/plots/area/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].areaId").value(1))
                .andExpect(jsonPath("$[1].areaId").value(1));
    }
}

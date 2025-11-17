package com.potsandplots.config;

import com.potsandplots.model.*;
import com.potsandplots.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private AreaRepository areaRepository;
    
    @Autowired
    private PlotRepository plotRepository;
    
    @Autowired
    private PlantTypeRepository plantTypeRepository;
    
    @Autowired
    private PlantRepository plantRepository;
    
    @Override
    public void run(String... args) throws Exception {
        initializeData();
    }
    
    private void initializeData() {
        // Create Areas
        Area livingRoom = new Area("Living Room", "indoor", true, false, "medium");
        Area frontGarden = new Area("Front Garden", "outdoor", false, false, "high");
        Area greenhouse = new Area("Greenhouse", "outdoor", true, true, "high");
        
        areaRepository.save(livingRoom);
        areaRepository.save(frontGarden);
        areaRepository.save(greenhouse);
        
        // Create Plots
        Plot tomatoBed = new Plot("Tomato Bed", frontGarden.getId(), "raised_bed", 4, 2);
        tomatoBed.setSoilType("loam");
        tomatoBed.setDrainageLevel("good");
        tomatoBed.setPh(6.8);
        
        Plot herbRow = new Plot("Herb Row", greenhouse.getId(), "row", 2, 6);
        herbRow.setSoilType("sandy_loam");
        herbRow.setDrainageLevel("excellent");
        herbRow.setPh(7.0);
        
        plotRepository.save(tomatoBed);
        plotRepository.save(herbRow);
        
        // Create Plant Types
        PlantType tomato = new PlantType("Tomato", "Solanum lycopersicum", true);
        tomato.setLightRequirements("full sun");
        tomato.setWaterRequirements("regular, deep watering");
        tomato.setSoilRequirements("rich, well-draining");
        tomato.setImageUrl("https://example.com/tomato.jpg");
        
        PlantType basil = new PlantType("Basil", "Ocimum basilicum", true);
        basil.setLightRequirements("full sun");
        basil.setWaterRequirements("regular, but not waterlogged");
        basil.setSoilRequirements("well-draining, fertile");
        basil.setImageUrl("https://example.com/basil.jpg");
        
        PlantType rosemary = new PlantType("Rosemary", "Rosmarinus officinalis", true);
        rosemary.setLightRequirements("full sun");
        rosemary.setWaterRequirements("infrequent, drought tolerant");
        rosemary.setSoilRequirements("well-draining, sandy");
        rosemary.setImageUrl("https://example.com/rosemary.jpg");
        
        PlantType spider = new PlantType("Spider Plant", "Chlorophytum comosum", false);
        spider.setLightRequirements("bright, indirect light");
        spider.setWaterRequirements("weekly, allow to dry between waterings");
        spider.setSoilRequirements("well-draining potting mix");
        spider.setImageUrl("https://example.com/spider-plant.jpg");
        
        PlantType pothos = new PlantType("Pothos", "Epipremnum aureum", false);
        pothos.setLightRequirements("low to moderate light");
        pothos.setWaterRequirements("weekly, allow to dry between waterings");
        pothos.setSoilRequirements("well-draining potting mix");
        pothos.setImageUrl("https://example.com/pothos.jpg");
        
        PlantType mint = new PlantType("Mint", "Mentha", true);
        mint.setLightRequirements("partial sun");
        mint.setWaterRequirements("frequent");
        mint.setSoilRequirements("moist, rich");
        mint.setImageUrl("https://example.com/mint.jpg");
        
        PlantType lavender = new PlantType("Lavender", "Lavandula", false);
        lavender.setLightRequirements("full sun");
        lavender.setWaterRequirements("weekly");
        lavender.setSoilRequirements("well-draining, sandy");
        lavender.setImageUrl("https://example.com/lavender.jpg");
        
        plantTypeRepository.save(tomato);
        plantTypeRepository.save(basil);
        plantTypeRepository.save(rosemary);
        plantTypeRepository.save(spider);
        plantTypeRepository.save(pothos);
        plantTypeRepository.save(mint);
        plantTypeRepository.save(lavender);
        
        // Create Plants
        Plant tomatoPlant1 = new Plant("Cherry Tom", tomato.getId(), frontGarden.getId());
        tomatoPlant1.setPlotId(tomatoBed.getId());
        tomatoPlant1.setPositionX(0);
        tomatoPlant1.setPositionY(0);
        tomatoPlant1.setPlantedDate(LocalDate.of(2024, 3, 15));
        tomatoPlant1.setNotes("Planted from seedling, growing well");
        
        Plant tomatoPlant2 = new Plant("Big Boy", tomato.getId(), frontGarden.getId());
        tomatoPlant2.setPlotId(tomatoBed.getId());
        tomatoPlant2.setPositionX(2);
        tomatoPlant2.setPositionY(1);
        tomatoPlant2.setPlantedDate(LocalDate.of(2024, 3, 20));
        
        Plant basilPlant = new Plant("Sweet Basil", basil.getId(), greenhouse.getId());
        basilPlant.setPlotId(herbRow.getId());
        basilPlant.setPositionX(0);
        basilPlant.setPositionY(0);
        basilPlant.setPlantedDate(LocalDate.of(2024, 4, 1));
        
        Plant rosemaryPlant = new Plant("Herb Garden Rosemary", rosemary.getId(), greenhouse.getId());
        rosemaryPlant.setPlotId(herbRow.getId());
        rosemaryPlant.setPositionX(1);
        rosemaryPlant.setPositionY(2);
        rosemaryPlant.setPlantedDate(LocalDate.of(2024, 2, 10));
        
        Plant spiderPlant = new Plant("Spider-1", spider.getId(), livingRoom.getId());
        spiderPlant.setPlantedDate(LocalDate.of(2024, 1, 5));
        spiderPlant.setNotes("Hanging plant near window");
        
        Plant pothosPlant = new Plant("Golden Pothos", pothos.getId(), livingRoom.getId());
        pothosPlant.setPlantedDate(LocalDate.of(2024, 2, 14));
        pothosPlant.setNotes("Trailing plant on shelf");
        
        plantRepository.save(tomatoPlant1);
        plantRepository.save(tomatoPlant2);
        plantRepository.save(basilPlant);
        plantRepository.save(rosemaryPlant);
        plantRepository.save(spiderPlant);
        plantRepository.save(pothosPlant);
        
        System.out.println("Sample data initialized successfully!");
    }
}

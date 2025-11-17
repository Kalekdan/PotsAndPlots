package com.potsandplots.repository;

import com.potsandplots.model.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlantRepository extends JpaRepository<Plant, Long> {
    List<Plant> findByAreaId(Long areaId);
    List<Plant> findByPlotId(Long plotId);
    List<Plant> findByAreaIdAndPlotIdIsNull(Long areaId);
    List<Plant> findByAreaIdAndPositionXAndPositionY(Long areaId, Integer positionX, Integer positionY);
}

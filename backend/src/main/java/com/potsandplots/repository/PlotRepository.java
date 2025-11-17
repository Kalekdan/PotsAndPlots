package com.potsandplots.repository;

import com.potsandplots.model.Plot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlotRepository extends JpaRepository<Plot, Long> {
    List<Plot> findByAreaId(Long areaId);
}

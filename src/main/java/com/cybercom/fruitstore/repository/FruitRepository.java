package com.cybercom.fruitstore.repository;

import com.cybercom.fruitstore.domain.Fruit;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Fruit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FruitRepository extends JpaRepository<Fruit, Long> {

}

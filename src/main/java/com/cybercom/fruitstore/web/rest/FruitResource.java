package com.cybercom.fruitstore.web.rest;

import com.cybercom.fruitstore.domain.Fruit;
import com.cybercom.fruitstore.repository.FruitRepository;
import com.cybercom.fruitstore.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.cybercom.fruitstore.domain.Fruit}.
 */
@RestController
@RequestMapping("/api")
public class FruitResource {

    private final Logger log = LoggerFactory.getLogger(FruitResource.class);

    private static final String ENTITY_NAME = "fruit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FruitRepository fruitRepository;

    public FruitResource(FruitRepository fruitRepository) {
        this.fruitRepository = fruitRepository;
    }

    /**
     * {@code POST  /fruits} : Create a new fruit.
     *
     * @param fruit the fruit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fruit, or with status {@code 400 (Bad Request)} if the fruit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fruits")
    public ResponseEntity<Fruit> createFruit(@RequestBody Fruit fruit) throws URISyntaxException {
        log.debug("REST request to save Fruit : {}", fruit);
        if (fruit.getId() != null) {
            throw new BadRequestAlertException("A new fruit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Fruit result = fruitRepository.save(fruit);
        return ResponseEntity.created(new URI("/api/fruits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fruits} : Updates an existing fruit.
     *
     * @param fruit the fruit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fruit,
     * or with status {@code 400 (Bad Request)} if the fruit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fruit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fruits")
    public ResponseEntity<Fruit> updateFruit(@RequestBody Fruit fruit) throws URISyntaxException {
        log.debug("REST request to update Fruit : {}", fruit);
        if (fruit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Fruit result = fruitRepository.save(fruit);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, fruit.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /fruits} : get all the fruits.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fruits in body.
     */
    @GetMapping("/fruits")
    public List<Fruit> getAllFruits() {
        log.debug("REST request to get all Fruits");
        return fruitRepository.findAll();
    }

    /**
     * {@code GET  /fruits/:id} : get the "id" fruit.
     *
     * @param id the id of the fruit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fruit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fruits/{id}")
    public ResponseEntity<Fruit> getFruit(@PathVariable Long id) {
        log.debug("REST request to get Fruit : {}", id);
        Optional<Fruit> fruit = fruitRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fruit);
    }

    /**
     * {@code DELETE  /fruits/:id} : delete the "id" fruit.
     *
     * @param id the id of the fruit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fruits/{id}")
    public ResponseEntity<Void> deleteFruit(@PathVariable Long id) {
        log.debug("REST request to delete Fruit : {}", id);
        fruitRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}

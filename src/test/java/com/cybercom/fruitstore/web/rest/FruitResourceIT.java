package com.cybercom.fruitstore.web.rest;

import com.cybercom.fruitstore.FruiteStoreApp;
import com.cybercom.fruitstore.domain.Fruit;
import com.cybercom.fruitstore.repository.FruitRepository;
import com.cybercom.fruitstore.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.cybercom.fruitstore.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link FruitResource} REST controller.
 */
@SpringBootTest(classes = FruiteStoreApp.class)
public class FruitResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final Long DEFAULT_PRICE = 1L;
    private static final Long UPDATED_PRICE = 2L;
    private static final Long SMALLER_PRICE = 1L - 1L;

    @Autowired
    private FruitRepository fruitRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restFruitMockMvc;

    private Fruit fruit;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FruitResource fruitResource = new FruitResource(fruitRepository);
        this.restFruitMockMvc = MockMvcBuilders.standaloneSetup(fruitResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fruit createEntity(EntityManager em) {
        Fruit fruit = new Fruit()
            .name(DEFAULT_NAME)
            .type(DEFAULT_TYPE)
            .price(DEFAULT_PRICE);
        return fruit;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fruit createUpdatedEntity(EntityManager em) {
        Fruit fruit = new Fruit()
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE)
            .price(UPDATED_PRICE);
        return fruit;
    }

    @BeforeEach
    public void initTest() {
        fruit = createEntity(em);
    }

    @Test
    @Transactional
    public void createFruit() throws Exception {
        int databaseSizeBeforeCreate = fruitRepository.findAll().size();

        // Create the Fruit
        restFruitMockMvc.perform(post("/api/fruits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fruit)))
            .andExpect(status().isCreated());

        // Validate the Fruit in the database
        List<Fruit> fruitList = fruitRepository.findAll();
        assertThat(fruitList).hasSize(databaseSizeBeforeCreate + 1);
        Fruit testFruit = fruitList.get(fruitList.size() - 1);
        assertThat(testFruit.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFruit.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testFruit.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    public void createFruitWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = fruitRepository.findAll().size();

        // Create the Fruit with an existing ID
        fruit.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFruitMockMvc.perform(post("/api/fruits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fruit)))
            .andExpect(status().isBadRequest());

        // Validate the Fruit in the database
        List<Fruit> fruitList = fruitRepository.findAll();
        assertThat(fruitList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllFruits() throws Exception {
        // Initialize the database
        fruitRepository.saveAndFlush(fruit);

        // Get all the fruitList
        restFruitMockMvc.perform(get("/api/fruits?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fruit.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())));
    }
    
    @Test
    @Transactional
    public void getFruit() throws Exception {
        // Initialize the database
        fruitRepository.saveAndFlush(fruit);

        // Get the fruit
        restFruitMockMvc.perform(get("/api/fruits/{id}", fruit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(fruit.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingFruit() throws Exception {
        // Get the fruit
        restFruitMockMvc.perform(get("/api/fruits/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFruit() throws Exception {
        // Initialize the database
        fruitRepository.saveAndFlush(fruit);

        int databaseSizeBeforeUpdate = fruitRepository.findAll().size();

        // Update the fruit
        Fruit updatedFruit = fruitRepository.findById(fruit.getId()).get();
        // Disconnect from session so that the updates on updatedFruit are not directly saved in db
        em.detach(updatedFruit);
        updatedFruit
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE)
            .price(UPDATED_PRICE);

        restFruitMockMvc.perform(put("/api/fruits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFruit)))
            .andExpect(status().isOk());

        // Validate the Fruit in the database
        List<Fruit> fruitList = fruitRepository.findAll();
        assertThat(fruitList).hasSize(databaseSizeBeforeUpdate);
        Fruit testFruit = fruitList.get(fruitList.size() - 1);
        assertThat(testFruit.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFruit.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testFruit.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    public void updateNonExistingFruit() throws Exception {
        int databaseSizeBeforeUpdate = fruitRepository.findAll().size();

        // Create the Fruit

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFruitMockMvc.perform(put("/api/fruits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fruit)))
            .andExpect(status().isBadRequest());

        // Validate the Fruit in the database
        List<Fruit> fruitList = fruitRepository.findAll();
        assertThat(fruitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteFruit() throws Exception {
        // Initialize the database
        fruitRepository.saveAndFlush(fruit);

        int databaseSizeBeforeDelete = fruitRepository.findAll().size();

        // Delete the fruit
        restFruitMockMvc.perform(delete("/api/fruits/{id}", fruit.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Fruit> fruitList = fruitRepository.findAll();
        assertThat(fruitList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Fruit.class);
        Fruit fruit1 = new Fruit();
        fruit1.setId(1L);
        Fruit fruit2 = new Fruit();
        fruit2.setId(fruit1.getId());
        assertThat(fruit1).isEqualTo(fruit2);
        fruit2.setId(2L);
        assertThat(fruit1).isNotEqualTo(fruit2);
        fruit1.setId(null);
        assertThat(fruit1).isNotEqualTo(fruit2);
    }
}

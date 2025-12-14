import request from 'supertest';
import { app } from '../api/app'; 
import { pool } from '../config/db'; 

jest.setTimeout(10000); 

describe('Integration Tests: Products API', () => {

  beforeEach(async () => {
    await pool.query('DELETE FROM products');
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('Standard Operations (Success)', () => {
    
    it('should create a valid product and retrieve it successfully', async () => {
      const newProduct = {
        name: "Integration Map",
        type: "raster",
        consumptionProtocol: "WMS",
        boundingPolygon: JSON.stringify({
          type: "Polygon",
          coordinates: [[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]]
        })
      };

      // 1. Create
      const postResponse = await request(app).post('/products').send(newProduct);
      expect(postResponse.status).toBe(201);
      expect(postResponse.body.id).toBeDefined(); 
      
      const createdId = postResponse.body.id;

      const getResponse = await request(app).get(`/products/${createdId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.name).toBe("Integration Map");
    });
  });

  describe('Input Validation & Error Handling', () => {
    
    it('should reject invalid ID format with 400 Bad Request', async () => {
      const response = await request(app).get('/products/abc');
      
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/Invalid id/i);
    });

    it('should enforce required fields validation (return 400)', async () => {
      const badProduct = {
        type: "raster"
      };

      const response = await request(app).post('/products').send(badProduct);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/Missing required field/i);
    });

    it('should return 404 Not Found for non-existent resource', async () => {
      const response = await request(app).get('/products/999999');
      expect(response.status).toBe(404);
    });
  });
});
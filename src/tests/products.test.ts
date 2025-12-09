import request from 'supertest';
import { app } from '../api/app'; 
import * as repo from '../dal/productRepo';

jest.mock('../dal/productRepo');

const mockedRepo = repo as jest.Mocked<typeof repo>;

describe('Integration Tests: /products', () => {
  
  // Reset mocks before each test to ensure clean state
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /products', () => {
    it('should return a list of products (200 OK)', async () => {
      // Arrange: Define what the DB *would* return
      const mockProducts = [
        { 
            id: 1, 
            name: 'Test Map', 
            type: 'raster', 
            consumptionProtocol: 'WMS', 
            boundingPolygon: '...' 
        }
      ];
      // @ts-ignore - We don't need to mock every single field for the test to pass
      mockedRepo.queryProducts.mockResolvedValue(mockProducts);

      // Act: Perform the request
      const response = await request(app).get('/products');

      // Assert: Check the results matches OpenAPI
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
      expect(mockedRepo.queryProducts).toHaveBeenCalledTimes(1);
    });

    it('should pass query filters to the repository', async () => {
      mockedRepo.queryProducts.mockResolvedValue([]);

      await request(app).get('/products?minZoom=5&type=raster');

      // Verify the controller parsed "5" into a number and passed it correctly
      expect(mockedRepo.queryProducts).toHaveBeenCalledWith(
        expect.objectContaining({
          minZoom: 5,
          type: 'raster'
        })
      );
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product when it exists (200 OK)', async () => {
        const mockProduct = { id: 10, name: 'Found Me', type: 'raster' };
        // @ts-ignore
        mockedRepo.getProductById.mockResolvedValue(mockProduct);

        const response = await request(app).get('/products/10');

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Found Me');
    });

    it('should return 404 if product is not found', async () => {
        // Simulate DB returning null
        mockedRepo.getProductById.mockResolvedValue(null);

        const response = await request(app).get('/products/999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Product not found');
    });

    it('should return 400 if ID is invalid', async () => {
        const response = await request(app).get('/products/abc');
        expect(response.status).toBe(400);
    });
  });

  describe('POST /products', () => {
    it('should create a new product (201 Created)', async () => {
      const newProductInput = {
        name: "New Map",
        type: "3d tiles",
        consumptionProtocol: "3D Tiles",
        boundingPolygon: "{ ... }"
      };

      const createdProduct = { ...newProductInput, id: 123 };
      // @ts-ignore
      mockedRepo.createProduct.mockResolvedValue(createdProduct);

      const response = await request(app)
        .post('/products')
        .send(newProductInput);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdProduct);
      expect(mockedRepo.createProduct).toHaveBeenCalledWith(newProductInput);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product (204 No Content)', async () => {
      mockedRepo.deleteProduct.mockResolvedValue(true);

      const response = await request(app).delete('/products/50');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should return 404 if trying to delete non-existent product', async () => {
      mockedRepo.deleteProduct.mockResolvedValue(false);

      const response = await request(app).delete('/products/50');

      expect(response.status).toBe(404);
    });
  });
});
import { pool } from '../config/db';
import { Product, ProductCreateInput, ProductUpdateInput } from '../types/product';
// נעזרתי בצאט
export async function createProduct(input: ProductCreateInput): Promise<Product> {
  const query = `
    INSERT INTO products
      (name, description, bounding_polygon, consumption_link, type, consumption_protocol, resolution_best, min_zoom, max_zoom)
    VALUES
      ($1, $2, ST_GeomFromGeoJSON($3), $4, $5, $6, $7, $8, $9)
    RETURNING
      id,
      name,
      description,
      ST_AsGeoJSON(bounding_polygon) as "boundingPolygon",
      consumption_link as "consumptionLink",
      type,
      consumption_protocol as "consumptionProtocol",
      resolution_best as "resolutionBest",
      min_zoom as "minZoom",
      max_zoom as "maxZoom"
  `;
  const values = [
    input.name,
    input.description ?? null,
    input.boundingPolygon,
    input.consumptionLink ?? null,
    input.type,
    input.consumptionProtocol,
    input.resolutionBest ?? null,
    input.minZoom ?? null,
    input.maxZoom ?? null,
  ];

  const result = await pool.query<Product>(query, values);
  return result.rows[0];
}

export async function getProductById(id: number): Promise<Product | null> {
  const query = `
    SELECT
      id,
      name,
      description,
      ST_AsGeoJSON(bounding_polygon) as "boundingPolygon",
      consumption_link as "consumptionLink",
      type,
      consumption_protocol as "consumptionProtocol",
      resolution_best as "resolutionBest",
      min_zoom as "minZoom",
      max_zoom as "maxZoom"
    FROM products
    WHERE id = $1
  `;
  const result = await pool.query<Product>(query, [id]);
  return result.rows[0] ?? null;
}

export async function getAllProducts(): Promise<Product[]> {
  const query = `
    SELECT
      id,
      name,
      description,
      ST_AsGeoJSON(bounding_polygon) as "boundingPolygon",
      consumption_link as "consumptionLink",
      type,
      consumption_protocol as "consumptionProtocol",
      resolution_best as "resolutionBest",
      min_zoom as "minZoom",
      max_zoom as "maxZoom"
    FROM products
  `;
  const result = await pool.query<Product>(query);
  return result.rows;
}

export async function updateProduct(id: number, input: ProductUpdateInput): Promise<Product | null> {
  const query = `
    UPDATE products
    SET
      name = $1,
      description = $2,
      bounding_polygon = ST_GeomFromGeoJSON($3),
      consumption_link = $4,
      type = $5,
      consumption_protocol = $6,
      resolution_best = $7,
      min_zoom = $8,
      max_zoom = $9
    WHERE id = $10
    RETURNING
      id,
      name,
      description,
      ST_AsGeoJSON(bounding_polygon) as "boundingPolygon",
      consumption_link as "consumptionLink",
      type,
      consumption_protocol as "consumptionProtocol",
      resolution_best as "resolutionBest",
      min_zoom as "minZoom",
      max_zoom as "maxZoom"
  `;
  const values = [
    input.name,
    input.description ?? null,
    input.boundingPolygon,
    input.consumptionLink ?? null,
    input.type,
    input.consumptionProtocol,
    input.resolutionBest ?? null,
    input.minZoom ?? null,
    input.maxZoom ?? null,
    id,
  ];

  const result = await pool.query<Product>(query, values);
  return result.rows[0] ?? null;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
  return result.rowCount === 1;
}

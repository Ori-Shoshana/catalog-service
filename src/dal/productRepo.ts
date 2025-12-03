import { pool } from '../config/db';
import { Product, ProductCreateInput, ProductUpdateInput } from '../types/product';
import { ProductQueryFilters } from '../types/filters';
//נעזרתי בצאט

const baseSelect = `
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
    ${baseSelect}
    WHERE id = $1
  `;
  const result = await pool.query<Product>(query, [id]);
  return result.rows[0] ?? null;
}

export async function getAllProducts(): Promise<Product[]> {
  const result = await pool.query<Product>(baseSelect);
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

export async function queryProducts(filters: ProductQueryFilters): Promise<Product[]> {
  const whereClauses: string[] = [];
  const values: any[] = [];
  let i = 1;

  const add = (clause: string, value: any) => {
    whereClauses.push(clause.replace('$', `$${i}`));
    values.push(value);
    i++;
  };

  if (filters.name !== undefined) {
    add('name = $', filters.name);
  }
  if (filters.type !== undefined) {
    add('type = $', filters.type);
  }
  if (filters.consumptionProtocol !== undefined) {
    add('consumption_protocol = $', filters.consumptionProtocol);
  }

  if (filters.minZoom !== undefined) {
    add('min_zoom = $', filters.minZoom);
  }
  if (filters.maxZoom !== undefined) {
    add('max_zoom = $', filters.maxZoom);
  }
  if (filters.resolutionBest !== undefined) {
    add('resolution_best = $', filters.resolutionBest);
  }

  if (filters.minZoomGreater !== undefined) {
    add('min_zoom > $', filters.minZoomGreater);
  }
  if (filters.minZoomGreaterEqual !== undefined) {
    add('min_zoom >= $', filters.minZoomGreaterEqual);
  }
  if (filters.minZoomLess !== undefined) {
    add('min_zoom < $', filters.minZoomLess);
  }
  if (filters.minZoomLessEqual !== undefined) {
    add('min_zoom <= $', filters.minZoomLessEqual);
  }

  if (filters.maxZoomGreater !== undefined) {
    add('max_zoom > $', filters.maxZoomGreater);
  }
  if (filters.maxZoomGreaterEqual !== undefined) {
    add('max_zoom >= $', filters.maxZoomGreaterEqual);
  }
  if (filters.maxZoomLess !== undefined) {
    add('max_zoom < $', filters.maxZoomLess);
  }
  if (filters.maxZoomLessEqual !== undefined) {
    add('max_zoom <= $', filters.maxZoomLessEqual);
  }

  if (filters.resolutionBestGreater !== undefined) {
    add('resolution_best > $', filters.resolutionBestGreater);
  }
  if (filters.resolutionBestGreaterEqual !== undefined) {
    add('resolution_best >= $', filters.resolutionBestGreaterEqual);
  }
  if (filters.resolutionBestLess !== undefined) {
    add('resolution_best < $', filters.resolutionBestLess);
  }
  if (filters.resolutionBestLessEqual !== undefined) {
    add('resolution_best <= $', filters.resolutionBestLessEqual);
  }

  if (filters.boundingPolygonContains !== undefined) {
    whereClauses.push(
      `ST_Contains(bounding_polygon, ST_GeomFromGeoJSON($${i}))`
    );
    values.push(filters.boundingPolygonContains);
    i++;
  }
  if (filters.boundingPolygonWithin !== undefined) {
    whereClauses.push(
      `ST_Within(bounding_polygon, ST_GeomFromGeoJSON($${i}))`
    );
    values.push(filters.boundingPolygonWithin);
    i++;
  }
  if (filters.boundingPolygonIntersects !== undefined) {
    whereClauses.push(
      `ST_Intersects(bounding_polygon, ST_GeomFromGeoJSON($${i}))`
    );
    values.push(filters.boundingPolygonIntersects);
    i++;
  }

  const whereSql =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const query = `
    ${baseSelect}
    ${whereSql}
  `;

  const result = await pool.query<Product>(query, values);
  return result.rows;
}

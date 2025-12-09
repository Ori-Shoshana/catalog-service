import { Request, Response } from 'express';
import * as repo from '../../dal/productRepo';
import { ProductCreateInput, ProductUpdateInput } from '../../types/product';
import { ProductQueryFilters } from '../../types/filters';

const VALID_TYPES = ['raster', 'rasterized vector', '3d tiles', 'QMesh'];
const VALID_PROTOCOLS = ['WMS', 'WMTS', 'XYZ', '3D Tiles'];

function parseNumber(value: unknown): number | undefined {
  if (typeof value === 'string') {
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }
  return undefined;
}

export async function getProducts(req: Request, res: Response) {
  try {
    const q = req.query;

    let safeType: any = undefined;
    if (typeof q.type === 'string' && VALID_TYPES.includes(q.type)) {
      safeType = q.type;
    }

    let safeProtocol: any = undefined;
    if (typeof q.consumptionProtocol === 'string' && VALID_PROTOCOLS.includes(q.consumptionProtocol)) {
      safeProtocol = q.consumptionProtocol;
    }

    const filters: ProductQueryFilters = {
      name: q.name as string | undefined,
      
      type: safeType,
      consumptionProtocol: safeProtocol,

      minZoom: parseNumber(q.minZoom),
      minZoomGreater: parseNumber(q.minZoomGreater),
      minZoomGreaterEqual: parseNumber(q.minZoomGreaterEqual),
      minZoomLess: parseNumber(q.minZoomLess),
      minZoomLessEqual: parseNumber(q.minZoomLessEqual),

      maxZoom: parseNumber(q.maxZoom),
      maxZoomGreater: parseNumber(q.maxZoomGreater),
      maxZoomGreaterEqual: parseNumber(q.maxZoomGreaterEqual),
      maxZoomLess: parseNumber(q.maxZoomLess),
      maxZoomLessEqual: parseNumber(q.maxZoomLessEqual),

      resolutionBest: parseNumber(q.resolutionBest),
      resolutionBestGreater: parseNumber(q.resolutionBestGreater),
      resolutionBestGreaterEqual: parseNumber(q.resolutionBestGreaterEqual),
      resolutionBestLess: parseNumber(q.resolutionBestLess),
      resolutionBestLessEqual: parseNumber(q.resolutionBestLessEqual),

      boundingPolygonContains: q.boundingPolygonContains as string | undefined,
      boundingPolygonWithin: q.boundingPolygonWithin as string | undefined,
      boundingPolygonIntersects: q.boundingPolygonIntersects as string | undefined,
    };

    const products = await repo.queryProducts(filters);
    res.json(products);
  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const product = await repo.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('getProductById error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const body = req.body as ProductCreateInput;
    const created = await repo.createProduct(body);
    res.status(201).json(created);
  } catch (err) {
    console.error('createProduct error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const body = req.body as ProductUpdateInput;
    const updated = await repo.updateProduct(id, body);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('updateProduct error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const ok = await repo.deleteProduct(id);
    if (!ok) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('deleteProduct error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

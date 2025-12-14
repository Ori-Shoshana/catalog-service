import { Request, Response } from 'express';
import * as repo from '../../dal/productRepo';
import { ConsumptionProtocol, ProductCreateInput, ProductType, ProductUpdateInput } from '../../types/product';
import { ProductQueryFilters } from '../../types/filters';
import { handleError } from '../../utils/errors';

// Helper function to safely parse numbers from query params
function parseNumber(value: unknown): number | undefined {
  if (typeof value === 'string') {
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }
  return undefined;
}

// --- Controller Methods ---

export async function getProducts(req: Request, res: Response) {
  try {
    const q = req.query;

    const safeType = q.type as ProductType;
    const safeProtocol = q.consumptionProtocol as ConsumptionProtocol;

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
    handleError(res, err);
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    
    // Validation: Check if ID is a valid number
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id: must be a number' });
    }

    const product = await repo.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    handleError(res, err);
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const body = req.body as ProductCreateInput;
    
    if (!body.name) {
      return res.status(400).json({ message: 'Missing required field: name' });
    }

    const created = await repo.createProduct(body);
    res.status(201).json(created);
    
  } catch (err) {
    handleError(res, err);
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
    handleError(res, err);
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

    res.status(204).send(); // 204 No Content
  } catch (err) {
    handleError(res, err);
  }
}
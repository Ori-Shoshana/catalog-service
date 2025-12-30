import * as repo from '../dal/productRepo';
import type {
  ConsumptionProtocol,
  ProductCreateInput,
  ProductType,
  ProductUpdateInput,
} from '../types/product';
import type { ProductQueryFilters } from '../types/filters';
import { BadRequestError, NotFoundError } from '../errors/httpErrors';

function parseId(idParam: unknown): number {
  if (typeof idParam !== 'string') throw new BadRequestError('Invalid id');
  const id = Number(idParam);
  if (!Number.isInteger(id)) throw new BadRequestError('Invalid id: must be a numeric string');
  return id;
}

function parseNumber(value: unknown, field: string): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw new BadRequestError(`Invalid ${field}`);
  const n = Number(value);
  if (Number.isNaN(n)) throw new BadRequestError(`Invalid ${field}: must be a number`);
  return n;
}

function parseString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export async function getProducts(query: any) {
  const filters: ProductQueryFilters = {
    name: parseString(query.name),

    type: parseString(query.type) as ProductType | undefined,
    consumptionProtocol: parseString(query.consumptionProtocol) as ConsumptionProtocol | undefined,

    minZoom: parseNumber(query.minZoom, 'minZoom'),
    minZoomGreater: parseNumber(query.minZoomGreater, 'minZoomGreater'),
    minZoomGreaterEqual: parseNumber(query.minZoomGreaterEqual, 'minZoomGreaterEqual'),
    minZoomLess: parseNumber(query.minZoomLess, 'minZoomLess'),
    minZoomLessEqual: parseNumber(query.minZoomLessEqual, 'minZoomLessEqual'),

    maxZoom: parseNumber(query.maxZoom, 'maxZoom'),
    maxZoomGreater: parseNumber(query.maxZoomGreater, 'maxZoomGreater'),
    maxZoomGreaterEqual: parseNumber(query.maxZoomGreaterEqual, 'maxZoomGreaterEqual'),
    maxZoomLess: parseNumber(query.maxZoomLess, 'maxZoomLess'),
    maxZoomLessEqual: parseNumber(query.maxZoomLessEqual, 'maxZoomLessEqual'),

    resolutionBest: parseNumber(query.resolutionBest, 'resolutionBest'),
    resolutionBestGreater: parseNumber(query.resolutionBestGreater, 'resolutionBestGreater'),
    resolutionBestGreaterEqual: parseNumber(query.resolutionBestGreaterEqual, 'resolutionBestGreaterEqual'),
    resolutionBestLess: parseNumber(query.resolutionBestLess, 'resolutionBestLess'),
    resolutionBestLessEqual: parseNumber(query.resolutionBestLessEqual, 'resolutionBestLessEqual'),

    boundingPolygonContains: parseString(query.boundingPolygonContains),
    boundingPolygonWithin: parseString(query.boundingPolygonWithin),
    boundingPolygonIntersects: parseString(query.boundingPolygonIntersects),
  };

  return repo.queryProducts(filters);
}

export async function getProductById(idParam: unknown) {
  const id = parseId(idParam);

  const product = await repo.getProductById(id);
  if (!product) throw new NotFoundError('Product not found');

  return product;
}

export async function createProduct(body: unknown) {
  const input = body as ProductCreateInput;

  if (!input?.name) throw new BadRequestError('Missing required field: name');

  return repo.createProduct(input);
}

export async function updateProduct(idParam: unknown, body: unknown) {
  const id = parseId(idParam);

  const input = body as ProductUpdateInput;
  const updated = await repo.updateProduct(id, input);

  if (!updated) throw new NotFoundError('Product not found');

  return updated;
}

export async function patchProduct(idParam: unknown, body: unknown) {
  const id = parseId(idParam);

  if (!body || typeof body !== 'object') {
    throw new BadRequestError('Invalid request body');
  }

  const patch = body as Partial<ProductUpdateInput>;

  const existing = await repo.getProductById(id);
  if (!existing) throw new NotFoundError('Product not found');

  const merged: ProductUpdateInput = {
    name: patch.name ?? existing.name,
    description: patch.description ?? existing.description ?? undefined,
    boundingPolygon: patch.boundingPolygon ?? existing.boundingPolygon,
    consumptionLink: patch.consumptionLink ?? existing.consumptionLink ?? undefined,
    type: patch.type ?? existing.type,
    consumptionProtocol: patch.consumptionProtocol ?? existing.consumptionProtocol,
    resolutionBest: patch.resolutionBest ?? existing.resolutionBest ?? undefined,
    minZoom: patch.minZoom ?? existing.minZoom ?? undefined,
    maxZoom: patch.maxZoom ?? existing.maxZoom ?? undefined,
  };

  const updated = await repo.updateProduct(id, merged);
  if (!updated) throw new NotFoundError('Product not found');

  return updated;
}


export async function deleteProduct(idParam: unknown) {
  const id = parseId(idParam);

  const ok = await repo.deleteProduct(id);
  if (!ok) throw new NotFoundError('Product not found');
}

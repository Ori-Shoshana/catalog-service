import type { ProductType, ConsumptionProtocol } from './product';

export interface ProductQueryFilters {

  name?: string;
  type?: ProductType;
  consumptionProtocol?: ConsumptionProtocol;

  minZoom?: number;
  minZoomGreater?: number;
  minZoomGreaterEqual?: number;
  minZoomLess?: number;
  minZoomLessEqual?: number;

  maxZoom?: number;
  maxZoomGreater?: number;
  maxZoomGreaterEqual?: number;
  maxZoomLess?: number;
  maxZoomLessEqual?: number;

  resolutionBest?: number;
  resolutionBestGreater?: number;
  resolutionBestGreaterEqual?: number;
  resolutionBestLess?: number;
  resolutionBestLessEqual?: number;

  boundingPolygonContains?: string;
  boundingPolygonWithin?: string;
  boundingPolygonIntersects?: string;
}

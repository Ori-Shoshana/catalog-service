export type ProductType = 'raster' | 'rasterized vector' | '3d tiles' | 'QMesh';

export type ConsumptionProtocol = 'WMS' | 'WMTS' | 'XYZ' | '3D Tiles';

export interface Product {
  id: number;
  name: string;
  description?: string;
  boundingPolygon: string;
  consumptionLink?: string;
  type: ProductType;
  consumptionProtocol: ConsumptionProtocol;
  resolutionBest?: number;
  minZoom?: number;
  maxZoom?: number;
}

// what the client sends on POST/PUT (no id) - נעזרתי בצאט
export type ProductCreateInput = Omit<Product, 'id'>;
export type ProductUpdateInput = ProductCreateInput;

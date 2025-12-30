import { RequestHandler } from 'express';
import * as productService from '../../src/services/productService';

export const getProducts: RequestHandler = async (req, res) => {
  const products = await productService.getProducts(req.query);
  res.json(products);
};

export const getProductById: RequestHandler = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json(product);
};

export const createProduct: RequestHandler = async (req, res) => {
  const created = await productService.createProduct(req.body);
  res.status(201).json(created);
};

export const updateProduct: RequestHandler = async (req, res) => {
  const updated = await productService.updateProduct(req.params.id, req.body);
  res.json(updated);
};

export const patchProduct: RequestHandler = async (req, res) => {
  const updated = await productService.patchProduct(req.params.id, req.body);
  res.json(updated);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).send();
};
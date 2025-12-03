import { Request, Response } from 'express';
import * as repo from '../../dal/productRepo';
import { ProductCreateInput, ProductUpdateInput } from '../../types/product';

export async function getProducts(_req: Request, res: Response) {
  try {
    const products = await repo.getAllProducts();
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

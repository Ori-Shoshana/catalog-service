import { Request, Response } from 'express';

export async function getProducts(req: Request, res: Response) {
  res.send('GET all products');
}

export async function getProductById(req: Request, res: Response) {
  res.send('GET product by id');
}

export async function createProduct(req: Request, res: Response) {
  res.send('CREATE product');
}

export async function updateProduct(req: Request, res: Response) {
  res.send('UPDATE product');
}

export async function deleteProduct(req: Request, res: Response) {
  res.send('DELETE product');
}

import express from 'express';
import productRoutes from './routes/productRoutes';

const app = express();

app.use(express.json());


export { app };
app.use('/products', productRoutes);

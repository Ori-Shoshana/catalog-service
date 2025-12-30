import express from 'express';
import productRoutes from './routes/productRoutes';

import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

app.use(express.json());

// swagger
const yamlPath = path.join(process.cwd(), 'openapi', 'openapi.yaml');
const swaggerDocument = yaml.load(yamlPath);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/products', productRoutes);

app.use(errorMiddleware);

export { app };
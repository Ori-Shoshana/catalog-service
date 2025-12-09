import express from 'express';
import productRoutes from './routes/productRoutes';

// Optional - swagger
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

const app = express();

app.use(express.json());

// swagger
const yamlPath = path.join(process.cwd(), 'openapi', 'openapi.yaml');
const swaggerDocument = yaml.load(yamlPath);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// End of swagger

export { app };
app.use('/products', productRoutes);
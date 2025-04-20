import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import errorMiddleware from './middleware/errorMiddleware';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Swagger UI
const swaggerFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './docs/swagger.json'), 'utf-8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "GympStore API Documentation"
}));

// Rotas da API
app.use('/api', routes);
app.use(errorMiddleware);

export default app;
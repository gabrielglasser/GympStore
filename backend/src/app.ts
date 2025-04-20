import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import errorMiddleware from './middleware/errorMiddleware';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';

const app = express();

// Configuração do CORS
app.use(cors());

// Configuração do Helmet (permitindo Swagger UI)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "GympStore API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true
  }
}));

// Rotas da API
app.use('/api', routes);

app.use(errorMiddleware);

export default app;
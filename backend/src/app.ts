import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import errorMiddleware from './middleware/errorMiddleware';
import swaggerRouter from './swagger';

const app = express();

// Configuração do CORS
app.use(cors());

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use('/api-docs', swaggerRouter);

// Rotas da API
app.use('/api', routes);

app.use(errorMiddleware);

export default app;
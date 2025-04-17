import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import errorMiddleware from './middleware/errorMiddleware';
import { Request, Response, NextFunction } from 'express';
import swaggerRouter from './swagger';

const app = express();

// Configuração do CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste para verificar se a API está funcionando
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API GympStore está funcionando!' });
});

// Rotas da API
app.use('/api', routes);
app.use('/api-docs', swaggerRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorMiddleware(err, req, res, next);
});

export default app;
import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const baseUrl = isDev 
  ? `http://localhost:${port}` 
  : 'https://gymp-store-backend.vercel.app';

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    app.listen(port, () => {
      console.log(`Server is running on ${baseUrl}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Exporta a URL base para uso em outros módulos
export const BASE_URL = baseUrl;
export default app;
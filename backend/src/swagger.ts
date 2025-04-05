import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json'; 
import { Router } from 'express';

const router = Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
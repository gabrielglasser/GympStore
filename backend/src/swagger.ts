import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';
import { Router } from 'express';

const router = Router();

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "GympStore API Documentation",
  swaggerOptions: {
    persistAuthorization: true
  }
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, options));

export default router;
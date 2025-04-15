import { Router } from 'express';
import paymentController from '../controllers/paymentController';
import  authMiddleware  from '../middleware/authMiddleware';

const router = Router();

router.get('/details', authMiddleware, paymentController.getPaymentDetails);
router.post('/process', authMiddleware, paymentController.processPayment);


export default router;
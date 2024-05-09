import express from 'express';
import { bookSession, cancelSession } from '../controllers/booking.controller';

const router = express.Router();

router.post('/book', bookSession);      
router.post('/cancel', cancelSession);  

export default router;

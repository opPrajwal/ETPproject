import express from 'express';
import { getDoubts, createDoubt } from '../controllers/doubtController.js';

const router = express.Router();

router.get('/', getDoubts);
router.post('/', createDoubt);

export default router;

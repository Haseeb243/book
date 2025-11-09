import express from 'express';
import { createCheckout, getAllCheckouts } from '../Controller/checkout-controller.js';

const router = express.Router();

// Route to create a checkout
router.post('/', createCheckout);

// Route to fetch all checkouts (optional, for admin use)
router.get('/', getAllCheckouts);

export default router;
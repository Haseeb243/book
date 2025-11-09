import express from "express";
import { addNewsletter } from "../Controller/newsletter-controller.js";

const router = express.Router();

router.post("/", addNewsletter);

export default router;

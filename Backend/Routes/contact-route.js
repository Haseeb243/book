import express from "express";
import { addContact } from "../Controller/contact-controller.js";

const router = express.Router();

// Register the POST route for adding contacts
router.route("/").post(addContact);

export default router;

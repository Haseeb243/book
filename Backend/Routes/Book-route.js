import express from "express";

import {
  getBook,
  getBookById,
  addBook,
} from "../Controller/Book-controller.js";

import multer from "multer";
import storage from "../config/storage.js";

const upload = multer({ storage });

const router = express.Router();

// GET all books
router.get("/", getBook);

// GET a single book by ID
router.get("/:id", getBookById);

// POST a new book with image upload
router.post("/", upload.single("image"), addBook);

// DELETE a book by ID
import { deleteBook } from "../Controller/Book-controller.js";
router.delete("/:id", deleteBook);

export default router;

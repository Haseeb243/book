import { Book } from "../Models/index.js";
import { resolveImageForResponse } from "../lib/image-url.js";

const toClient = async (doc) => {
  if (!doc) return null;
  const plain = doc.toObject();
  const imagePayload = await resolveImageForResponse(plain.image);
  return { ...plain, ...imagePayload, _id: plain._id };
};

export const getBook = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    const serialized = await Promise.all(books.map((b) => toClient(b)));
    res.status(200).json(serialized);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    const payload = await toClient(book);
    res.status(200).json(payload);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Failed to fetch book" });
  }
};

export const addBook = async (req, res) => {
  try {
    const { name, price, category, title, description } = req.body;
    let imagePath = req.body.image;
    if (req.file) {
      imagePath = `/${req.file.filename}`;
    } else if (typeof imagePath === "string") {
      imagePath = imagePath.trim();
      if (imagePath && !imagePath.startsWith("/")) imagePath = `/${imagePath}`;
    }
    const numericPrice = Number(price) || 0;
    const newBook = await Book.create({
      name,
      price: numericPrice,
      category,
      image: imagePath,
      title,
      description,
    });
    const clientBook = await toClient(newBook);
    res
      .status(201)
      .json({ message: "Book added successfully!", book: clientBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res
      .status(500)
      .json({ message: "Failed to add book", error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res
      .status(500)
      .json({ message: "Failed to delete book", error: error.message });
  }
};

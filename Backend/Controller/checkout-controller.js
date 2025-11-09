import mongoose from "../lib/mongoose.js";
import { Checkout, Book } from "../Models/index.js";

export const createCheckout = async (req, res) => {
  try {
    const { bookId, price, quantity, name, email, address, city, state, zip } =
      req.body;
    if (!bookId || !name || !email || !address || !city || !state || !zip) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!mongoose.isValidObjectId(bookId)) {
      return res.status(400).json({ message: "Invalid bookId" });
    }
    const numericPrice = Number(price);
    const numericQty = Number(quantity);
    if (Number.isNaN(numericPrice) || Number.isNaN(numericQty)) {
      return res.status(400).json({ message: "Invalid price or quantity" });
    }
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    const totalPrice = numericPrice * numericQty;
    await Checkout.create({
      bookId,
      price: totalPrice,
      quantity: numericQty,
      name,
      email,
      address,
      city,
      state,
      zip,
    });
    res.status(201).json({ message: "Checkout data saved successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save checkout data", error: error.message });
  }
};

export const getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await Checkout.find()
      .sort({ createdAt: -1 })
      .populate({ path: "bookId", select: "name price" });
    const mapped = checkouts.map((c) => {
      const plain = c.toObject();
      const out = { ...plain, _id: plain._id };
      if (plain.bookId && typeof plain.bookId === "object") {
        out.book = {
          _id: plain.bookId._id,
          name: plain.bookId.name,
          price: plain.bookId.price,
        };
      }
      delete out.bookId; // keep response clean
      return out;
    });
    res.status(200).json(mapped);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch checkouts", error: error.message });
  }
};

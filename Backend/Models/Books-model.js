import mongoose from "../lib/mongoose.js";

const BookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    category: { type: String, required: true, default: "General" },
    image: { type: String },
    title: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);

export default Book;

import mongoose from "../lib/mongoose.js";

const CheckoutSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { timestamps: true }
);

const Checkout = mongoose.model("Checkout", CheckoutSchema);
export default Checkout;

import mongoose from "../lib/mongoose.js";

const NewsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Newsletter = mongoose.model("Newsletter", NewsletterSchema);
export default Newsletter;

import { Newsletter } from "../Models/index.js";

export const addNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    await Newsletter.create({ email });
    res
      .status(201)
      .json({ message: "Email added to newsletter successfully!" });
  } catch (error) {
    const isDuplicate =
      error && (error.code === 11000 || error.name === "MongoServerError");
    res.status(isDuplicate ? 409 : 500).json({
      message: isDuplicate
        ? "Email is already subscribed"
        : "Failed to add email to newsletter",
    });
  }
};

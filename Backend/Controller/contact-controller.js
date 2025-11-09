import { Contact } from "../Models/index.js";

export const addContact = async (req, res) => {
  const { name, email, message, phone } = req.body;
  try {
    await Contact.create({ name, email, message, phone });
    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit contact form" });
    console.error("Error saving contact:", error);
  }
};

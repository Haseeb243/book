import { User } from "../Models/index.js";
import bcryptjs from "bcryptjs";

export const signupUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });
    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      fullname,
      email,
      password: hashPassword,
    });
    res
      .status(201)
      .json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
        },
      });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid Username or Password" });
    const isMatchPassword = await bcryptjs.compare(password, user.password);
    if (!isMatchPassword)
      return res.status(400).json({ message: "Invalid Username or Password" });
    const adminEmail = process.env.ADMIN_EMAIL;
    const isAdmin = adminEmail ? email === adminEmail : false;
    res
      .status(200)
      .json({
        message: "Login Successful!",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          isAdmin,
        },
      });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json(
        users.map((u) => ({
          _id: u._id,
          fullname: u.fullname,
          email: u.email,
          createdAt: u.createdAt,
        }))
      );
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

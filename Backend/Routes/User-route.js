import express from "express";
import {
  signupUser,
  loginUser,
  getAllUsers,
} from "../Controller/User-controller.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/all", getAllUsers);

export default router;

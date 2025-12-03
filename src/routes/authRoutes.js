import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import LoginLog from "../models/loginLogModel.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    // Store login details
    const loginLog = new LoginLog({
      userId: user._id,
      email: user.email,
      ipAddress: req.ip,
      device: req.headers["user-agent"]
    });
    await loginLog.save();

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;

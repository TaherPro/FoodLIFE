import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return next(new ApiError(400, "Email already registered"));

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      role,
      passwordHash,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new ApiError(400, "Invalid credentials"));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new ApiError(400, "Invalid credentials"));

    res.json({
      id: user._id,
      name: user.name,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

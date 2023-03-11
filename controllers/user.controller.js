import User from "../mongodb/models/user.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import path from "path"; // import the path module
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const createUserEmailPassword = async (req, res) => {
  const { email, password, name, avatar, location, phone, role } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({ message: "Email already registered" });
    }

    const userData = {
      email,
      password: password || "",
      name: name || "Anonymous",
      avatar: avatar || "",
      location: location || "",
      phone: phone || "",
      role: role || "user",
    };

    if (userData.avatar === "") {
      // If avatar is not provided, use the default picture
      const imagePath = path.join(__dirname, "anonymous.png");
      const result = await cloudinary.uploader.upload(imagePath);
      userData.avatar = result.secure_url;
    }

    const newUser = await User.create(userData);

    res.status(200).json({
      email: newUser.email,
      password: newUser.password,
      name: newUser.name,
      avatar: newUser.avatar,
      location: newUser.location,
      phone: newUser.phone,
      role: newUser.role,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) return res.status(200).json(userExists);

    const newUser = await User.create({
      name,
      email,
      avatar,
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).limit(req.query._end);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserInfoByID = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id }).populate("allProjects");

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = () => {};
const deleteUser = () => {};

export {
  getAllUsers,
  createUser,
  createUserEmailPassword,
  getUserInfoByID,
  updateUser,
  deleteUser,
};

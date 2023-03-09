import User from "../mongodb/models/user.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const createUserEmailPassword = async (req, res) => {
  try {
    const { name, email, password, avatar, phone, location } = req.body;
    const newEmail = req.body.email;

    const session = await mongoose.startSession();
    session.startTransaction();
    console.log(newEmail);
    const user = await User.findOne({ email }).session(session);
    // Check if user with the same email already exists
    if (user) {
      return res
        .status(400)
        .json({ message: "User with the same email already exists" });
    }

    const photoUrl = await cloudinary.uploader.upload(avatar);
    // Create new user
    const newUser = await User.create({
      name,
      email: newEmail, // overwrite email with new email
      password,
      avatar: photoUrl.url,
      phone,
      location,
    });

    await user.save({ session });
    await session.commitTransaction();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

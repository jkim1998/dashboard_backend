import Ticket from "../mongodb/models/ticket.js";
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

const createTicket = async (req, res) => {
  try {
    const { title, description, priority, email } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);
    // const project = await Project.findById({ _id}).session(session);

    if (!user) throw new Error("User not found");
    // if (!project) throw new Error("Project not found");

    // const photoUrl = await cloudinary.uploader.upload(photo);

    const newTicket = await Ticket.create({
      title,
      description,
      priority,
      // photo: photoUrl.url,
      creator: user._id,
      // projectOf: project._id
    });

    // user.creator.push(newTicket._id);
    // await user.save({ session });

    // project.projectOf.push(newTicket._id);
    // await project.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Ticket created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const users = await Ticket.find({}).limit(req.query._end);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketDetail = async (req, res) => {
  const { id } = req.params;
  const propertyExists = await Ticket.findOne({ _id: id }).populate("creator");

  if (propertyExists) {
    res.status(200).json(propertyExists);
  } else {
    res.status(404).json({ message: "Ticket not found" });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, propertyType, location, price, photo } =
      req.body;

    const photoUrl = await cloudinary.uploader.upload(photo);

    await Ticket.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        propertyType,
        location,
        price,
        photo: photoUrl.url || photo,
      }
    );

    res.status(200).json({ message: "Ticket updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticketToDelete = await Ticket.findById({ _id: id }).populate(
      "creator"
    );
    if (!ticketToDelete) throw new Error("Ticket not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    ticketToDelete.remove({ session });
    ticketToDelete.creator.allProjects.pull(ticketToDelete);
    await ticketToDelete.creator.save({ session });
    await session.commitTransaction();
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllTickets,
  getTicketDetail,
  createTicket,
  updateTicket,
  deleteTicket,
};

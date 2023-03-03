import Project from "../mongodb/models/project.js";
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

const createProject = async (req, res) => {
  try {
    const {
      title,
      github,
      preview,
      description,
      projectType,
      photo,
      tag,
      lead,
      members,
      email,
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error("User not found");

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newProject = await Project.create({
      title,
      description,
      github,
      preview,
      members,
      tag,
      projectType,
      photo: photoUrl.url,
      lead: user._id,
    });

    user.allProjects.push(newProject._id);
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Project created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProjects = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    title_like = "",
    projectType = "",
  } = req.query;

  const query = {};

  if (projectType !== "") {
    query.projectType = projectType;
  }

  if (title_like) {
    query.title = { $regex: title_like, $options: "i" };
  }

  try {
    const count = await Project.countDocuments({ query });

    const Projects = await Project.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(Projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectDetail = async (req, res) => {
  const { id } = req.params;
  const projectExists = await Project.findOne({ _id: id }).populate("lead");

  if (projectExists) {
    res.status(200).json(projectExists);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      github,
      preview,
      members,
      tag,
      projectType,
      photo,
      lead,
    } = req.body;

    const photoUrl = await cloudinary.uploader.upload(photo);
    console.log("id", id);
    const user = await User.findById("63f9232a4aecb8b197fe2435");
    await Project.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        github,
        preview,
        projectType,
        members,
        tag,
        projectType,
        lead,
        photo: photoUrl.url,
      }
    );

    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const projectToDelete = await Project.findById({ _id: id }).populate(
      "lead"
    );

    if (!projectToDelete) throw new Error("Project not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    projectToDelete.remove({ session });
    projectToDelete.lead.allProjects.pull(projectToDelete);

    await projectToDelete.lead.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketInfoByID = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findOne({ _id: id }).populate("allTickets");

    if (ticket) {
      res.status(200).json(ticket);
    } else {
      res.status(404).json({ message: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllProjects,
  getProjectDetail,
  createProject,
  updateProject,
  deleteProject,
};

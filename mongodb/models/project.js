import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  github: { type: String, required: false },
  preview: { type: String, required: false },
  projectType: { type: String, required: true },
  tag: [String],
  photo: { type: String, required: true },
  members: [String],
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const propertyModel = mongoose.model("Project", ProjectSchema);

export default propertyModel;

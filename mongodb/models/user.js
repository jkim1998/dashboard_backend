import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  avatar: { type: String, required: true },
  allProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;

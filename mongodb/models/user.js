import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, required: false },
  phone: { type: String },
  location: { type: String },
  avatar: { type: String, required: false },
  allProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true },
  allProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "projects" }],
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;

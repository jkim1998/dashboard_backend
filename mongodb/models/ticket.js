import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // ticketType: { type: String, required: true },
  // ticketNumber: { type: Number, required: true },
  // photo: { type: String, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ticketModel = mongoose.model("Ticket", TicketSchema);

export default ticketModel;

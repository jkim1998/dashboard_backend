import express from "express";

import {
  createTicket,
  getAllTickets,
  getTicketDetail,
  updateTicket,
  deleteTicket,
} from "../controllers/ticket.controller.js";

const router = express.Router();

router.route("/").post(createTicket);
router.route("/").get(getAllTickets);
router.route("/:id").get(getTicketDetail);
router.route("/:id").patch(updateTicket);
router.route("/:id").delete(deleteTicket);

export default router;

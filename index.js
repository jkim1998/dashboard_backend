import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.routes.js";
import ticketRouter from "./routes/ticket.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello Server!");
});

// middleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tickets", ticketRouter);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(8080, () =>
      console.log(
        "Server started on port https://dashboard-server-aq1z.onrender.com | http://localhost:8080"
      )
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();

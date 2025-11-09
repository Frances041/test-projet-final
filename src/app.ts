import express from "express";
import projectsRouter from "./routes/projects";

const app = express();
app.use(express.json());
app.use("/projects", projectsRouter);

export default app;
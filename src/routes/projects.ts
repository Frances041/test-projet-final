// src/routes/projects.ts
import { Router } from "express";
import { getAllProjects, createProject, getProjectById } from "../controllers/projectsController";

const router = Router();

router.get("/", getAllProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);

export default router;
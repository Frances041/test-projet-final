// src/routes/projects.ts
import { Router } from "express";
import { getAllProjects, createProject } from "../controllers/projectsController";

const router = Router();

router.get("/", getAllProjects);
router.post("/", createProject);

export default router;
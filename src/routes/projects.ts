// src/routes/projects.ts
import { Router } from "express";
import { getAllProjects, createProject, getProjectById, updateProjectGrade } from "../controllers/projectsController";

const router = Router();

router.get("/", getAllProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.put("/:id/grade", updateProjectGrade);

export default router;
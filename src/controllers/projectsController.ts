// src/controllers/projectsController.ts
import { Request, Response } from "express";
import { Project, ProjectSchema } from "../models/project";
import { readDB, writeDB } from "../utils/fileManager";

export const getAllProjects = (_req: Request, res: Response) => {
  const projects = readDB();
  return res.json(projects);
};

export const createProject = (req: Request, res: Response) => {
  const validation = ProjectSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Erreur de validation",
      errors: validation.error.issues,
    });
  }

  const projects = readDB();

  const newProject: Project = {
    ...validation.data,
    id: projects.length ? projects[projects.length - 1].id! + 1 : 1,
    createdAt: new Date().toISOString(),
  };

  projects.push(newProject);
  writeDB(projects);

  return res.status(201).json(newProject);
};
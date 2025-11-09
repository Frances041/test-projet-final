// src/controllers/projectsController.ts
import { Request, Response } from "express";
import { Project, ProjectSchema } from "../models/project";
import { readDB, writeDB } from "../utils/fileManager";

export const getAllProjects = (_: Request, res: Response) => {
  const projects = readDB();
  res.json(projects);
};

export const createProject = (req: Request, res: Response) => {
  const result = ProjectSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error);

  const projects = readDB();
  const newProject: Project = {
    ...result.data,
    id: projects.length ? projects[projects.length - 1].id! + 1 : 1,
    createdAt: new Date().toISOString(),
  };
  projects.push(newProject);
  writeDB(projects);
  res.status(201).json(newProject);
};
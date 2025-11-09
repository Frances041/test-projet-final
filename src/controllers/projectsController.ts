// src/controllers/projectsController.ts
import { Request, Response } from "express";
import { Project, ProjectSchema } from "../models/project";
import { readDB, writeDB } from "../utils/fileManager";

export const getAllProjects = (_req: Request, res: Response) => {
  const projects = readDB();
  return res.status(200).json(projects);
};

export const getProjectById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const projects = readDB();
  const project = projects.find((p) => p.id === id);
  if (!project) return res.status(404).json({ message: "Projet non trouvé" });
  res.json(project);
};

export const updateProjectGrade = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const grade = Number(req.body.grade);
  const projects = readDB();
  const project = projects.find((p) => p.id === id);
  if (!project) return res.status(404).json({ message: "Projet non trouvé" });
  project.grade = grade;
  writeDB(projects);
  res.json(project);
};

export const deleteProject = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  let projects = readDB();
  const found = projects.find((p) => p.id === id);
  if (!found) return res.status(404).json({ message: "Projet non trouvé" });
  projects = projects.filter((p) => p.id !== id);
  writeDB(projects);
  res.status(204).send();
};

export const getByCourse = (req: Request, res: Response) => {
  const course = req.params.courseName.toLowerCase();
  const projects = readDB();
  const filtered = projects.filter(
    (p) => p.course && p.course.toLowerCase() === course,
  );
  res.json(filtered);
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
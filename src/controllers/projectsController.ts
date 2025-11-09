// src/controllers/projectsController.ts
import { Request, Response } from "express";
import { Project, ProjectCreateSchema } from "../models/project";
import { readDB, writeDB } from "../utils/fileManager";

/**
 *  Créer un nouveau projet
 */
export const createProject = (req: Request, res: Response) => {
  const parseResult = ProjectCreateSchema.safeParse(req.body);

  // Vérification de la validation avec Zod
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Validation échouée",
      errors: parseResult.error.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  const payload = parseResult.data;

  // Lecture actuelle du fichier db.json
  const projects = readDB();

  // Génération d’un nouvel ID auto-incrémenté
  const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;

  const newProject: Project = {
    id: newId,
    studentName: payload.studentName,
    course: payload.course,
    githubUrl: payload.githubUrl,
    grade: payload.grade,
    createdAt: new Date().toISOString(),
  };

  projects.push(newProject);
  writeDB(projects);

  return res.status(201).json(newProject);
};

/**
 * ?? Récupérer tous les projets
 */
export const getAllProjects = (_req: Request, res: Response) => {
  const projects = readDB();
  return res.status(200).json(projects);
};

/**
 * ?? Récupérer un projet par ID
 */
export const getProjectById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const projects = readDB();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ message: "Projet non trouvé" });
  }

  return res.status(200).json(project);
};

/**
 * ?? Mettre à jour la note d’un projet
 */
export const updateProjectGrade = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const grade = Number(req.body.grade);

  if (isNaN(grade)) {
    return res.status(400).json({ message: "La note doit être un nombre valide" });
  }

  const projects = readDB();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ message: "Projet non trouvé" });
  }

  project.grade = grade;
  writeDB(projects);

  return res.status(200).json(project);
};

/**
 * ??? Supprimer un projet
 */
export const deleteProject = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  let projects = readDB();

  const found = projects.find((p) => p.id === id);
  if (!found) {
    return res.status(404).json({ message: "Projet non trouvé" });
  }

  projects = projects.filter((p) => p.id !== id);
  writeDB(projects);

  return res.status(204).send();
};

/**
 * ?? Lister les projets par cours
 */
export const getByCourse = (req: Request, res: Response) => {
  const course = req.params.courseName.toLowerCase();
  const projects = readDB();

  const filtered = projects.filter(
    (p) => p.course && p.course.toLowerCase() === course,
  );

  return res.status(200).json(filtered);
};
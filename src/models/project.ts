// src/models/project.ts
import { z } from "zod";

// Schéma de validation pour la création d’un projet
export const ProjectCreateSchema = z.object({
  studentName: z.string().min(2, { message: "Le nom de l'étudiant est requis" }),
  course: z.string().min(2, { message: "Le nom du cours est requis" }),
  githubUrl: z.string().url({ message: "L'URL GitHub doit être valide" }),
  grade: z.number().min(0).max(20).optional(),
});

// Schéma complet pour un projet (inclut les champs générés par le serveur)
export const ProjectSchema = ProjectCreateSchema.extend({
  id: z.number(),
  createdAt: z.string(), // format ISO
});

export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type Project = z.infer<typeof ProjectSchema>;
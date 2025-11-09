// src/models/project.ts
import { z } from "zod";

export const ProjectSchema = z.object({
  studentName: z.string().min(2, "Le nom de l'étudiant est requis"),
  course: z.string().min(2, "Le nom du cours est requis"),
  githubUrl: z.string().url("L'URL GitHub doit être valide"),
  grade: z.number().min(0).max(20).optional(),
});

export type Project = z.infer<typeof ProjectSchema> & {
  id?: number;
  createdAt?: string;
};
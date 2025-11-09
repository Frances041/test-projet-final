import fs from "fs";
import path from "path";
import { Project } from "../models/project";

const dbPath = path.join(__dirname, "../../db.json");

export const ensureDB = (): void => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "[]", "utf-8");
  }
};

export const readDB = (): Project[] => {
  ensureDB();
  const raw = fs.readFileSync(dbPath, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Project[];
  } catch {
    // si fichier corrompu on réinitialise (log)
    fs.writeFileSync(dbPath, "[]", "utf-8");
    return [];
  }
};

export const writeDB = (projects: Project[]): void => {
  fs.writeFileSync(dbPath, JSON.stringify(projects, null, 2), "utf-8");
};
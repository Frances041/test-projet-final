// src/utils/fileManager.ts
import fs from "fs";
import path from "path";
import { Project } from "../models/project";

const dbPath = path.join(__dirname, "../../db.json");

export const readDB = (): Project[] => {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Erreur de lecture du fichier db.json :", err);
    return [];
  }
};

export const writeDB = (projects: Project[]): void => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(projects, null, 2));
  } catch (err) {
    console.error("Erreur d’écriture dans db.json :", err);
  }
};
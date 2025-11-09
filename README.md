ProjetAPI – TP Versionning Git & GitHub (Node.js + Express + Zod)

But du projet :
Construire, versionner et collaborer sur une API REST “ProjetAPI” tout en respectant les bonnes pratiques Git Flow et DevOps (Phases 1 & 2).

Phase 1 — Initialisation du projet
 Objectif

Créer la structure de base du projet, initialiser Git et GitHub, et mettre en place les outils de développement.

 Technologies utilisées

Node.js (v20+)

TypeScript

Express.js

Zod (validation des données)

Jest + Supertest (tests)

Husky + lint-staged + ESLint + Prettier (qualité du code)

Git / GitHub (collaboration)

?? Étapes d’initialisation
1?? Création du projet et initialisation Git
mkdir test-projet-final
cd test-projet-final
npm init -y
git init

2?? Installation des dépendances
npm install express zod
npm install -D typescript ts-node nodemon jest ts-jest @types/jest supertest @types/supertest eslint prettier husky lint-staged

3?? Initialisation TypeScript
npx tsc --init


Exemple de configuration :

{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src", "tests"]
}

?? Structure du projet
test-projet-final/
+- src/
¦  +- app.ts
¦  +- index.ts
¦  +- models/
¦  ¦  +- project.ts
¦  +- controllers/
¦  ¦  +- projectsController.ts
¦  +- routes/
¦  ¦  +- projects.ts
¦  +- utils/
¦  ¦  +- fileManager.ts
+- tests/
¦  +- postProject.test.ts
+- db.json
+- package.json
+- tsconfig.json
+- .eslintrc.json
+- .prettierrc
+- README.md

?? Configuration ESLint & Prettier
.eslintrc.json
{
  "env": {
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"]
  }
}

.prettierrc
{
  "singleQuote": false,
  "semi": true,
  "tabWidth": 2
}

?? Configuration Husky et lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

Dans package.json
"lint-staged": {
  "*.ts": ["eslint --fix", "prettier --write"]
}


? Cela empêche tout commit contenant du code non formaté.

?? Fichier src/index.ts
import app from "./app";

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`? Serveur lancé sur http://localhost:${PORT}`);
});

?? Fichier src/app.ts
import express from "express";
import projectsRouter from "./routes/projects";

const app = express();
app.use(express.json());
app.use("/projects", projectsRouter);

export default app;

?? Fichier src/models/project.ts
import { z } from "zod";

// Validation lors de la création
export const ProjectCreateSchema = z.object({
  studentName: z.string().min(2, { message: "Le nom de l'étudiant est requis" }),
  course: z.string().min(2, { message: "Le nom du cours est requis" }),
  githubUrl: z.string().url({ message: "L'URL GitHub doit être valide" }),
  grade: z.number().min(0).max(20).optional(),
});

// Schéma complet (avec champs ajoutés côté serveur)
export const ProjectSchema = ProjectCreateSchema.extend({
  id: z.number(),
  createdAt: z.string(),
});

export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type Project = z.infer<typeof ProjectSchema>;

?? Fichier src/utils/fileManager.ts
import fs from "fs";
import path from "path";
import { Project } from "../models/project";

const dbPath = path.join(__dirname, "../../db.json");

export const readDB = (): Project[] => {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "[]", "utf-8");
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

export const writeDB = (projects: Project[]): void => {
  fs.writeFileSync(dbPath, JSON.stringify(projects, null, 2));
};

?? Fichier src/controllers/projectsController.ts
import { Request, Response } from "express";
import { Project, ProjectCreateSchema } from "../models/project";
import { readDB, writeDB } from "../utils/fileManager";

export const createProject = (req: Request, res: Response) => {
  const result = ProjectCreateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Erreur de validation",
      errors: result.error.errors,
    });
  }

  const projects = readDB();
  const newProject: Project = {
    id: projects.length + 1,
    ...result.data,
    createdAt: new Date().toISOString(),
  };
  projects.push(newProject);
  writeDB(projects);
  return res.status(201).json(newProject);
};

?? Fichier src/routes/projects.ts
import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectGrade,
  deleteProject,
  getByCourse,
} from "../controllers/projectsController";

const router = Router();

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id/grade", updateProjectGrade);
router.delete("/:id", deleteProject);
router.get("/course/:courseName", getByCourse);

export default router;

? Test de l’API (PowerShell)
? POST /projects
$body = @{
  studentName = "Brook Frances"
  course = "DevOps"
  githubUrl = "https://github.com/Frances041/test-projet-final"
  grade = 15
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/projects" -Method POST -Body $body -ContentType "application/json"

?? GET /projects
curl "http://localhost:3000/projects"

?? GET /projects/1
curl "http://localhost:3000/projects/1"

?? PUT /projects/1/grade
$body = '{"grade": 19}'
Invoke-RestMethod -Uri "http://localhost:3000/projects/1/grade" -Method PUT -Body $body -ContentType "application/json"

? DELETE /projects/1
Invoke-RestMethod -Uri "http://localhost:3000/projects/1" -Method DELETE

?? Tests Jest
?? tests/postProject.test.ts
import request from "supertest";
import fs from "fs";
import path from "path";
import app from "../src/app";

const dbPath = path.join(__dirname, "../db.json");

beforeEach(() => {
  fs.writeFileSync(dbPath, "[]", "utf-8");
});

test("POST /projects crée un projet valide", async () => {
  const payload = {
    studentName: "Brook Frances",
    course: "DevOps",
    githubUrl: "https://github.com/Frances041/test-projet-final",
    grade: 15,
  };

  const res = await request(app)
    .post("/projects")
    .send(payload)
    .set("Accept", "application/json");

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
  expect(res.body.studentName).toBe(payload.studentName);
  expect(res.body.course).toBe(payload.course);
  expect(res.body.githubUrl).toBe(payload.githubUrl);
  expect(res.body).toHaveProperty("createdAt");
});

? Résultats obtenus
> npm run test

PASS  tests/postProject.test.ts
  ? POST /projects crée un projet valide (105 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total


? Les tests fonctionnent et l’API répond correctement aux requêtes.

?? Phase 2 — Collaboration Git Flow
1?? Création de la branche develop
git checkout -b develop
git push -u origin develop

2?? Création des branches feature/*

feature/post-project ? POST /projects

feature/get-projects ? GET /projects

feature/get-by-id ? GET /projects/:id

feature/update-grade ? PUT /projects/:id/grade

feature/delete-project ? DELETE /projects/:id

feature/get-by-course ? GET /projects/course/:courseName

feature/docs ? Documentation

3?? Commit & Pull Requests
git add .
git commit -m "Feat: POST /projects endpoint (fixes #1)"
git push -u origin feature/post-project


Puis sur GitHub :

Créer une Pull Request vers develop

Ajouter 2 reviewers

Corriger si besoin

Fusionner avec Squash and Merge

?? Étapes terminées (Phase 1 & 2)
Phase	Description	Statut
1	Initialisation du projet (Express, TS, Zod)	?
2	Création et tests des endpoints REST	?
2.1	Git Flow et PRs simulées	?
2.2	Tests Jest fonctionnels	?
2.3	Documentation et README complet	?
?? Étape suivante

Phase 3 — DevOps & Automatisation
Configuration du pipeline CI/CD, IA Gemini Review et règles de protection de branches.
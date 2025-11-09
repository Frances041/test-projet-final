import request from "supertest";
import fs from "fs";
import path from "path";
import app from "../src/app"; // Vérifie que ce chemin est correct

const dbPath = path.join(__dirname, "../db.json");

// Avant chaque test, on réinitialise la base (db.json)
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

  // ? Le serveur doit répondre 201
  expect(res.status).toBe(201);

  // ? Le corps de la réponse doit contenir les bons champs
  expect(res.body).toHaveProperty("id");
  expect(res.body.studentName).toBe(payload.studentName);
  expect(res.body.course).toBe(payload.course);
  expect(res.body.githubUrl).toBe(payload.githubUrl);
  expect(res.body.grade).toBe(payload.grade);
  expect(res.body).toHaveProperty("createdAt");
});
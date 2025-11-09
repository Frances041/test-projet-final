import express from "express";
import projectsRouter from "./routes/projects";
import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`? Serveur lancé sur http://localhost:${PORT}`);
});
app.use("/projects", projectsRouter);

app.get("/", (_, res) => {
  res.send("? API ProjetAPI fonctionne. Utilisez /projects pour accéder aux endpoints.");
});

app.listen(PORT, () => {
  console.log(`? Serveur lancé sur http://localhost:${PORT}`);
});
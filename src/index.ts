import express from "express";
import projectsRouter from "./routes/projects";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/projects", projectsRouter);

app.get("/", (_, res) => {
  res.send("? API ProjetAPI fonctionne. Utilisez /projects pour accéder aux endpoints.");
});

app.listen(PORT, () => {
  console.log(`? Serveur lancé sur http://localhost:${PORT}`);
});
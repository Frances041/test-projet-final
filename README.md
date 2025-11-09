## Endpoints API

### POST /projects
Créer un projet.
```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"ProjetAPI","course":"DevOps"}'
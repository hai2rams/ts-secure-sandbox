# AI Agent Hackathon Backend

A clean FastAPI backend skeleton for a secure, production-style AI agent app.

## Project structure

```
app/
├── main.py          # FastAPI app entry point
├── auth/            # Authentication (coming soon)
├── agent/           # Agent orchestration (coming soon)
├── guardrails/      # Safety checks (coming soon)
├── tools/           # Agent tools (coming soon)
└── models/          # Shared Pydantic schemas
```

## Setup

1. Create and activate a virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate   # macOS / Linux
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

## Run the server

From the project root:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at [http://localhost:8000](http://localhost:8000).

## Endpoints

| Method | Path       | Description              |
|--------|------------|--------------------------|
| GET    | `/health`  | Health check             |
| GET    | `/docs`    | Interactive API docs     |
| GET    | `/auth/`   | Auth module placeholder  |
| GET    | `/agent/`  | Agent module placeholder |
| GET    | `/guardrails/` | Guardrails placeholder |
| GET    | `/tools/`  | Tools module placeholder |

## Quick test

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{"status": "ok"}
```

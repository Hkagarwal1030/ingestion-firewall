# Ingestion Firewall

A small full-stack demo that classifies customer messages into structured intent, risk, and priority fields. The frontend is a static HTML/CSS/JavaScript page; the backend is a FastAPI service that uses Groq and Instructor to generate and validate structured model output.

## Project structure

```text
intent/
├── backend/       # FastAPI API and Groq integration
├── frontend/      # Static browser interface
└── ScreenshotWeek1.png
```

For component-specific setup and details, see the [backend README](./backend/README.md) and [frontend README](./frontend/README.md).

## Prerequisites

- Python 3.10 or later
- A Groq API key for message analysis
- A modern browser

## Run locally

### 1. Configure and start the backend

In PowerShell, from the project root:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirments.txt
Copy-Item .env.example .env
```

Edit `backend\.env` and set `GROQ_API_KEY` to your own key. Do not share or commit this file. `GROQ_MODEL` is optional; the default is `openai/gpt-oss-120b`. Check Groq for current model availability for your account.

Start the API from the `backend` directory:

```powershell
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`. Interactive API documentation is at `http://127.0.0.1:8000/docs`; the health endpoint is `http://127.0.0.1:8000/health`.

### 2. Open the frontend

Keep the backend running. Open `frontend\index.html` in a browser, or serve the `frontend` folder with a local static web server. The page sends requests to `http://127.0.0.1:8000/api/analyze`.

## API overview

`POST /api/analyze` accepts a JSON message, for example:

```json
{
  "message": "Where is my order?"
}
```

The response contains the classified intent, risk profile, priority, whether follow-up action is needed, a short summary, and an estimated input token count. Supported intents are `greeting`, `order_tracking`, `payment_issue`, `current_time`, `general_question`, and `unknown`.

## Behavior and limitations

- This demo classifies messages only. It does not retrieve order details, perform payments, or look up the current time.
- Token counts are local estimates and are not billing records.
- Analysis requests require a valid Groq API key and a model available to the account.
- The backend currently has permissive CORS settings for local development. Restrict allowed origins before deploying it publicly.

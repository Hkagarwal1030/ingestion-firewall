# Ingestion Firewall Backend

FastAPI service that classifies customer messages using a Groq-hosted language model and validates the structured response with Pydantic.

## Requirements

- Python 3.10 or later
- A Groq API key
- Dependencies listed in `requirments.txt` (the filename is spelled this way in the project)

## Setup on Windows

Open PowerShell in the `backend` folder:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirments.txt
Copy-Item .env.example .env
```

Edit `.env` and replace the placeholder with your Groq API key. Keep this file private and do not commit it. The model can be changed with `GROQ_MODEL`; the default is `openai/gpt-oss-120b`. Confirm the model is currently available to your Groq account.

Run the development server from the `backend` directory:

```powershell
python -m uvicorn app.main:app --reload --port 8000
```

Using `python -m uvicorn` helps ensure Uvicorn runs in the active virtual environment. The API is then available at `http://127.0.0.1:8000`. Interactive API documentation is at `http://127.0.0.1:8000/docs`.

## Configuration

| Variable | Required | Description |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes, for analysis requests | API key used to authenticate with Groq. |
| `GROQ_MODEL` | No | Groq model ID. Defaults to `openai/gpt-oss-120b`. |

The application loads `backend/.env` and also checks environment variables already present in the process.

## API

### `GET /health`

Returns a simple health response and does not call the language model:

```json
{
  "status": "ok",
  "message": "Ingestion Firewall API is running"
}
```

### `POST /api/analyze`

Accepts a message of 1–5,000 characters:

```json
{
  "message": "Where is my order?"
}
```

Successful responses contain:

| Field | Description |
| --- | --- |
| `intent` | One of `greeting`, `order_tracking`, `payment_issue`, `current_time`, `general_question`, or `unknown`. |
| `risk_profile` | `low`, `medium`, `high`, or `unknown`. |
| `priority` | `low`, `medium`, or `high`. |
| `requires_action` | Whether another service or follow-up would be needed to complete the request. |
| `summary` | Brief description of the user's request. |
| `token_metadata` | Local estimated input token count and an explanatory note. |

Input validation errors return HTTP 422. If model output fails schema validation or the provider request fails, the API returns HTTP 502. The response intentionally avoids exposing internal provider details.

## Project layout

```text
backend/
├── app/
│   ├── main.py                 # FastAPI app and routes
│   ├── config.py               # Environment and model configuration
│   ├── schemas/
│   │   └── ingestion.py        # Request and response Pydantic models
│   ├── services/
│   │   └── llm_service.py      # Groq/Instructor structured analysis
│   └── utils/
│       └── token_counter.py    # Local token estimate
├── .env.example                # Environment variable template
└── requirments.txt             # Python dependencies
```

## Notes

- This service classifies messages; it does not actually retrieve orders, inspect payments, or look up the current time.
- Token counts are estimates for context budgeting, not provider billing records.
- CORS is currently configured permissively for local development. Restrict allowed origins before exposing the service in production.

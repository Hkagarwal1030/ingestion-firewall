# Ingestion Firewall Frontend

A lightweight browser interface for the Ingestion Firewall API. Enter a customer message, submit it for intent analysis, and view the validated JSON response.

## Features

- Submit messages to the backend for analysis.
- Try predefined greeting, order-tracking, payment-issue, and current-time examples.
- See a live character count (messages are limited to 5,000 characters).
- View success, validation, and connection status.
- Copy a successful JSON response to the clipboard.
- Responsive layout for desktop and mobile.

## Files

- `index.html` — page structure and interface text.
- `style.css` — layout, colors, typography, and responsive styles.
- `script.js` — example buttons, API requests, status messages, and copy behavior.

## Run locally

1. Start the FastAPI backend on `http://127.0.0.1:8000`. See the backend README or setup instructions for its dependencies and environment variables.
2. Open `index.html` in a browser, or serve the `frontend` folder with a local static web server.
3. Use an example or enter a message, then select **Analyze message**.

The frontend currently sends requests to `http://127.0.0.1:8000/api/analyze`, as configured by `API_URL` in `script.js`. If the backend runs at a different address, update that constant. The backend must allow requests from the frontend origin through its CORS configuration.

## API contract

The frontend sends a JSON request:

```json
{
  "message": "Where is my order?"
}
```

It expects the backend to return a JSON response matching its `IngestionResult` schema. On successful responses, the result is displayed and can be copied. On failed responses, the frontend displays the response body and HTTP status.

## Notes

- The interface classifies messages; it does not look up orders or retrieve the current time.
- Token counts are estimates, not billing records.
- The page loads DM Sans, Manrope, and DM Mono from Google Fonts when an internet connection is available, with system-font fallbacks.

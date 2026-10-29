const API_URL = "http://127.0.0.1:8000";
const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submit");
const statusText = document.getElementById("status");
const result = document.getElementById("result");
const copyButton = document.getElementById("copy");
const charCount = document.getElementById("char-count");

function setStatus(message, state = "idle") {
  statusText.textContent = message;
  statusText.dataset.state = state;
}

messageInput.addEventListener("input", () => {
  charCount.textContent = `${messageInput.value.length} / 5000`;
});

document.querySelectorAll(".example").forEach((button) => {
  button.addEventListener("click", () => {
    messageInput.value = button.dataset.message;
    charCount.textContent = `${messageInput.value.length} / 5000`;
    messageInput.focus();
  });
});

submitButton.addEventListener("click", async () => {
  const message = messageInput.value.trim();
  if (!message) {
    setStatus("Please enter a message first.", "error");
    messageInput.focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.innerHTML = 'Analyzing <span aria-hidden="true">…</span>';
  setStatus("Sending message to the backend…", "loading");
  copyButton.disabled = true;

  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    if (!response.ok) {
      result.textContent = JSON.stringify(data, null, 2);
      setStatus(`Request failed (${response.status}). Check the response or backend logs.`, "error");
      return;
    }

    result.textContent = JSON.stringify(data, null, 2);
    setStatus("Success — response passed schema validation.", "success");
    copyButton.disabled = false;
  } catch (error) {
    setStatus("Could not connect. Start the FastAPI backend and try again.", "error");
    result.textContent = String(error);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Analyze message <span aria-hidden="true">→</span>';
  }
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(result.textContent);
    setStatus("JSON copied to clipboard.", "success");
  } catch {
    setStatus("Clipboard access failed. Select and copy the JSON manually.", "error");
  }
});
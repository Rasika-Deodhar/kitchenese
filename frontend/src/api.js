const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ApiError extends Error {}

export async function fetchAnalogy(concept, cuisine, mode) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api/analogy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept, cuisine, mode }),
    });
  } catch {
    throw new ApiError("Couldn't reach the kitchen. Check your connection and try again.");
  }

  let body;
  try {
    body = await res.json();
  } catch {
    throw new ApiError("The kitchen sent back something unreadable. Try again.");
  }

  if (!res.ok) {
    throw new ApiError(body?.error || `Request failed (${res.status})`);
  }

  return body;
}

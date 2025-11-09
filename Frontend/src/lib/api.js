import axios from "axios";

function resolveApiBaseUrl() {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }

  const fallback = import.meta.env.DEV ? "http://localhost:5000/api" : "/api";

  return fallback.replace(/\/$/, "");
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

export default api;

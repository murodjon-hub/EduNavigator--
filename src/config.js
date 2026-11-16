// URL of the Cloudflare Worker that proxies the AI assistant to Gemini.
// See worker/README.md for how to deploy it and get this URL.
//
// While this is empty the assistant falls back to its built-in scripted
// answers, so the app keeps working before the Worker exists.
export const AI_PROXY_URL = '';

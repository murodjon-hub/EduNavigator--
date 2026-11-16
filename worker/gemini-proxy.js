/**
 * Cloudflare Worker backing the EduNavigator AI assistant.
 *
 * edunavigator.site is static files on a CDN, so it has nowhere to keep an API
 * key secret — anything in the React bundle is readable by every visitor. This
 * Worker holds the key as a Cloudflare secret and is the only thing that ever
 * talks to Google.
 *
 * Deploy: see README.md in this folder.
 */

const DEFAULT_MODEL = 'gemini-3.6-flash';

const ALLOWED_ORIGINS = [
  'https://edunavigator.site',
  'https://www.edunavigator.site',
];

// One question cannot be allowed to burn the daily free-tier quota on its own.
const MAX_QUESTION_CHARS = 2000;
const MAX_HISTORY_TURNS = 8;

const SYSTEM_PROMPT = `You are the AI assistant inside EduNavigator, a free platform that helps
students in Uzbekistan write academic work: kurs ishi (coursework), bitiruv malakaviy ishi (BMI),
magistrlik dissertatsiyasi (master's dissertation) and ilmiy maqola (research articles).

LANGUAGE: Reply in the SAME language the student wrote in. Uzbek (Latin script), Russian and
English are all expected. If the student writes Uzbek, answer in natural Uzbek — not translated
word-for-word from English.

SCOPE: You explain HOW to write academic work — structure, methodology, citation and reference
formatting, academic style, literature search, reducing plagiarism, and the formal requirements
used in Uzbekistan. If a question is unrelated to academic work or study, say briefly that you
only help with ilmiy ish and offer a relevant topic instead.

ACADEMIC INTEGRITY: Never write a student's thesis, chapter, abstract or conclusion for them to
submit as their own. If asked to, explain that you cannot, then help properly: give the structure
to follow, the questions that section must answer, and an example of the *form* rather than
submittable text. Helping someone learn to write is the goal; producing their submission is not.

ACCURACY: Uzbek regulations, required originality percentages and university-specific rules vary
by institution and change over time. When something depends on the student's own university or on
current regulations, say so and tell them to confirm with their supervisor or kafedra rather than
inventing a precise figure.

STYLE: Be concrete and brief. Prefer short numbered steps over long paragraphs. Markdown is fine.`;

function corsHeaders(origin) {
  // Local dev servers are allowed so the app can be tested before deploying.
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
  const allowed = ALLOWED_ORIGINS.includes(origin) || isLocal;
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405, origin);
    }

    // A browser always sends Origin on a cross-site POST. This keeps the Worker
    // from being a free, anonymous Gemini endpoint for anyone who finds the URL.
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (!ALLOWED_ORIGINS.includes(origin) && !isLocal) {
      return json({ error: 'forbidden_origin' }, 403, origin);
    }

    if (!env.GEMINI_API_KEY) {
      return json({ error: 'missing_api_key' }, 500, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'bad_request' }, 400, origin);
    }

    const question = String(payload.question || '').trim();
    if (!question) return json({ error: 'empty_question' }, 400, origin);
    if (question.length > MAX_QUESTION_CHARS) {
      return json({ error: 'question_too_long' }, 413, origin);
    }

    // Prior turns give the model context; cap them so the prompt stays small.
    const history = Array.isArray(payload.history) ? payload.history.slice(-MAX_HISTORY_TURNS) : [];
    const contents = [
      ...history
        .filter((m) => m && typeof m.text === 'string' && m.text.trim())
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(m.text).slice(0, MAX_QUESTION_CHARS) }],
        })),
      { role: 'user', parts: [{ text: question }] },
    ];

    const model = env.GEMINI_MODEL || DEFAULT_MODEL;
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    let upstream;
    try {
      upstream = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
        }),
      });
    } catch {
      return json({ error: 'upstream_unreachable' }, 502, origin);
    }

    if (!upstream.ok) {
      // 429 means the free-tier quota is spent; the app shows its own message.
      const status = upstream.status === 429 ? 429 : 502;
      return json({ error: status === 429 ? 'rate_limited' : 'upstream_error' }, status, origin);
    }

    const data = await upstream.json();
    const answer = data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || '')
      .join('')
      .trim();

    if (!answer) return json({ error: 'empty_answer' }, 502, origin);

    return json({ answer }, 200, origin);
  },
};

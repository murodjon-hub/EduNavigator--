# EduNavigator AI proxy

The site is static, so it cannot hold an API key — anything in the React bundle
is readable by every visitor, and public keys get scraped and drained. This
Worker keeps the Gemini key as a Cloudflare secret and is the only thing that
talks to Google.

## Deploy

Both accounts below are free and neither needs a credit card.

**1. Get a Gemini API key** — <https://aistudio.google.com/apikey> → *Create API key*.
Copy it. Do not paste it into any file in this repo.

**2. Create a free Cloudflare account** — <https://dash.cloudflare.com/sign-up>.

**3. Deploy, from this folder:**

```bash
cd worker
npx wrangler login     # opens a browser once, approve access
npx wrangler deploy    # creates the Worker, prints its URL
npx wrangler secret put GEMINI_API_KEY
```

Deploy before setting the secret, so the Worker exists when the secret is
attached. The secret takes effect immediately — no second deploy needed.

The last command asks for the key and waits. **Type the key at that prompt —
do not write it into this command, this file, or any other file in the repo.**
Anything committed here ends up public on GitHub. A key pasted into a file
must be treated as leaked: revoke it at <https://aistudio.google.com/apikey>
and create a new one.

Prefer a GUI? Deploy first, then in the Cloudflare dashboard open
*Workers & Pages → edunavigator-ai → Settings → Variables and Secrets →
Add → Secret*, name it `GEMINI_API_KEY`, and paste the value there.

`wrangler deploy` prints the Worker URL, e.g.
`https://edunavigator-ai.<your-subdomain>.workers.dev`. That URL is not a
secret — it is safe to commit in `src/config.js`.

**4. Point the app at it** — put that URL in `src/config.js` as `AI_PROXY_URL`,
then commit and push. GitHub Actions redeploys the site automatically.

## Notes

- Only `edunavigator.site`, `www.edunavigator.site` and localhost may call this
  Worker. A browser always sends `Origin` on a cross-site POST, so this stops
  the URL from being a free anonymous Gemini endpoint. It is not a defence
  against a determined attacker using curl — for that, add a Cloudflare Rate
  Limiting rule (the free plan includes one) in the dashboard under
  *Security → WAF → Rate limiting rules*.
- Questions are capped at 2000 characters and history at 8 turns, so a single
  request cannot burn the daily free quota.
- **Free-tier prompts are used by Google to improve their products.** Students
  should not paste unpublished research into the chat. The app shows a notice
  above the input.
- If the free quota runs out, the Worker returns `429` and the app shows its
  own "try again later" message rather than an error.

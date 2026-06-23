// server.js
// CircuitLens AI — Backend proxy for AI-powered component search
// Uses Groq's free, fast LLM API. Keeps your API key safe on the server, never exposed to the browser.

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Trust Vercel/proxy headers so rate limiting sees real client IPs
app.set('trust proxy', 1);

// ── RATE LIMITING ──
// General limiter: protects the whole API from abuse
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,                  // 60 requests per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in a few minutes.' }
});

// Stricter limiter just for the AI endpoint (the expensive one)
const identifyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 8,              // 8 searches per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many searches — please wait a moment before trying again.' }
});

app.use(generalLimiter);

const SYSTEM_PROMPT = `You are CircuitLens AI's component identification engine. Given a component name or description, return ONLY a JSON object (no markdown, no backticks, no preamble) with this EXACT structure:
{"icon":"<single relevant emoji>","name":"<proper component name>","type":"<component category, e.g. Passive Component, Microcontroller, IC, Sensor>","info":[{"l":"<label>","v":"<value>"},{"l":"<label>","v":"<value>"},{"l":"<label>","v":"<value>"},{"l":"<label>","v":"<value>"}],"chips":["<short tag>","<short tag>","<short tag>","<short tag>"],"desc":"<1-2 sentence plain-English explanation of what it does and how it's used>","working":"<2-3 sentence explanation of the underlying physics/electronics principle>","applications":["<use case 1>","<use case 2>","<use case 3>","<use case 4>"]}
Use real, technically accurate electronics specifications. If the input is not a real or recognizable electronic component, set "name" to "Not Recognized" and explain in "desc" instead.`;

// Simple in-memory cache so repeated lookups don't cost API calls every time
const cache = new Map();

app.post('/api/identify', identifyLimiter, async (req, res) => {
  const query = (req.body.query || '').trim();

  if (!query) {
    return res.status(400).json({ error: 'Missing "query" in request body' });
  }
  if (query.length > 200) {
    return res.status(400).json({ error: 'Query too long' });
  }

  const cacheKey = query.toLowerCase();
  if (cache.has(cacheKey)) {
    return res.json({ ...cache.get(cacheKey), cached: true });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: query }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', response.status, errText);
      return res.status(502).json({ error: 'AI service unavailable' });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      return res.status(502).json({ error: 'No response from AI' });
    }

    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    cache.set(cacheKey, parsed);
    res.json(parsed);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`CircuitLens AI backend running on http://localhost:${PORT}`);
});

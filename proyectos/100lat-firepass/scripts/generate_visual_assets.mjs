import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const envPath = path.join(projectRoot, '.env.local');
const outputDir = path.join(projectRoot, 'public', 'images', 'generated');
const force = process.argv.includes('--force');

async function loadEnvLocal(filePath) {
  let content;
  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') return;
    throw error;
  }
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

await loadEnvLocal(envPath);

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(`OPENAI_API_KEY is missing from ${envPath}`);
}

const prompts = [
  {
    filename: 'charlie-idle.png',
    label: 'Charlie',
    prompt: `3D Pixar/Disney-style animated character illustration, charismatic TV game-show host,
man in his 50s, warm brown skin, clean shaved bald head, neat trimmed mustache, big
genuine showman smile, wearing a bright royal purple suit jacket with a golden lapel
trim, holding a golden microphone, standing on a game-show stage with blurred neon
fire-orange and gold lights in the background, warm cinematic studio lighting, square
1:1 framing, clean render, no text, no logos, no watermark`,
  },
  {
    filename: 'hombre-idle.png',
    label: 'Avatar masculino',
    prompt: `3D Pixar-style animated character illustration, Latino man, late 20s to mid 30s,
casual aspirational outfit (light collared shirt, no formal suit), hopeful nervous
expression, same rendering style and warm studio lighting as a game-show contestant,
square 1:1 framing, clean render, no text, no logos, no watermark`,
  },
  {
    filename: 'mujer-idle.png',
    label: 'Avatar femenino',
    prompt: `3D Pixar-style animated character illustration, Latina woman, late 20s to mid 30s,
casual aspirational outfit, hopeful nervous expression, same rendering style and warm
studio lighting as a game-show contestant, square 1:1 framing, clean render, no text,
no logos, no watermark`,
  },
];

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function fileInfo(filePath) {
  try {
    return await fs.stat(filePath);
  } catch (error) {
    if (error && error.code === 'ENOENT') return null;
    throw error;
  }
}

function extractBase64(payload) {
  if (typeof payload?.b64_json === 'string' && payload.b64_json.length > 0) {
    return payload.b64_json;
  }
  const first = payload?.data?.[0];
  if (typeof first?.b64_json === 'string' && first.b64_json.length > 0) {
    return first.b64_json;
  }
  return null;
}

async function generateImage({ prompt, filename, label }) {
  const destination = path.join(outputDir, filename);
  const existing = await fileInfo(destination);

  if (existing && !force) {
    console.log(`${filename}: skipped (already exists)`);
    return { status: 'skipped', destination, size: existing.size };
  }

  console.log(`${filename}: generating (${label})`);
  console.log('Approximate cost: a small per-image API charge may apply.');

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      n: 1,
    }),
  });

  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  if (!response.ok) {
    let message = rawText.trim();
    if (contentType.includes('application/json')) {
      try {
        const parsed = JSON.parse(rawText);
        message = parsed?.error?.message || parsed?.message || message;
      } catch {
        // fall through with raw text
      }
    }
    throw new Error(`OpenAI Images API error for ${filename}: ${message}`);
  }

  let payload;
  try {
    payload = JSON.parse(rawText);
  } catch {
    throw new Error(`OpenAI Images API returned non-JSON success payload for ${filename}`);
  }

  const base64 = extractBase64(payload);
  if (!base64) {
    throw new Error(`OpenAI Images API response did not include image data for ${filename}`);
  }

  const buffer = Buffer.from(base64, 'base64');
  if (buffer.length === 0) {
    throw new Error(`Decoded image data was empty for ${filename}`);
  }

  await fs.writeFile(destination, buffer);
  const written = await fs.stat(destination);

  if (written.size === 0) {
    throw new Error(`Wrote empty file for ${filename}`);
  }

  console.log(`${filename}: generated (${written.size} bytes)`);
  return { status: 'generated', destination, size: written.size };
}

async function main() {
  await ensureOutputDir();

  const results = [];
  for (const item of prompts) {
    results.push(await generateImage(item));
  }

  return results;
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});

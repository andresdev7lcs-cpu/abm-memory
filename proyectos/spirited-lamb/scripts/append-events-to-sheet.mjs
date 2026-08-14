#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createSign } from 'node:crypto';

const sheetId = '16wYzSI5Ls8SPqL93N0VNxGM6iIFtQheVJUmGiKodsK8';
const tabName = 'Sheet1';
const scope = 'https://www.googleapis.com/auth/spreadsheets';
const tokenUri = 'https://oauth2.googleapis.com/token';
const keyPath = path.resolve(
  '/Users/work945/Documents/Proyectos/ABM/proyectos/spirited-lamb/secrets-no-git/spiritedlamb2026-e0ced2501b12.json',
);

const events = [
  [
    'Misa Matutina',
    '2026-08-03',
    '08:00',
    '09:00',
    'Iglesia San Jose',
    'Parroquia San Jose',
    'Cucuta',
    'Norte de Santander',
    'Misa',
    'Gratis',
    'https://example.com/images/misa-matutina.jpg',
    'https://example.com/events/misa-matutina',
    'Celebracion matutina para iniciar la semana con la comunidad parroquial.',
  ],
  [
    'Retiro Espiritual',
    '2026-08-08',
    '09:00',
    '16:00',
    'Casa de Retiros La Esperanza',
    'Parroquia Nuestra Senora del Rosario',
    'Bucaramanga',
    'Santander',
    'Retiro',
    '50.000 COP',
    'https://example.com/images/retiro-espiritual.jpg',
    'https://example.com/events/retiro-espiritual',
    'Jornada de oracion, silencio y acompañamiento espiritual para la comunidad.',
  ],
  [
    'Bautismo',
    '2026-08-10',
    '11:00',
    '12:30',
    'Capilla Santa Ana',
    'Parroquia Santa Ana',
    'Manizales',
    'Caldas',
    'Sacramento',
    'Gratis',
    'https://example.com/images/bautismo.jpg',
    'https://example.com/events/bautismo',
    'Celebracion del sacramento del bautismo con familias invitadas.',
  ],
  [
    'Taller Biblia',
    '2026-08-14',
    '18:30',
    '20:00',
    'Salon Parroquial',
    'Parroquia Cristo Rey',
    'Medellin',
    'Antioquia',
    'Taller',
    'Gratis',
    'https://example.com/images/taller-biblia.jpg',
    'https://example.com/events/taller-biblia',
    'Taller de lectura biblica para profundizar en la Palabra y la reflexion comunitaria.',
  ],
  [
    'Fiesta Patronal',
    '2026-08-22',
    '10:00',
    '22:00',
    'Plaza Principal',
    'Parroquia Nuestra Senora del Carmen',
    'Pasto',
    'Narino',
    'Celebracion',
    'Gratis',
    'https://example.com/images/fiesta-patronal.jpg',
    'https://example.com/events/fiesta-patronal',
    'Fiesta patronal con eucaristia, procesion, musica y encuentro comunitario.',
  ],
];

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function signJwt(privateKeyPem, header, payload) {
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(privateKeyPem).toString('base64url');
  return `${signingInput}.${signature}`;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!response.ok) {
    const detail = body?.error?.message || body?.error_description || body?.message || body?.raw || text;
    throw new Error(`HTTP ${response.status} ${response.statusText} for ${url}\n${detail}`);
  }
  return body;
}

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccount.client_email,
    scope,
    aud: serviceAccount.token_uri || tokenUri,
    iat: now,
    exp: now + 3600,
  };
  const assertion = signJwt(serviceAccount.private_key, header, payload);
  const tokenResponse = await fetchJson(serviceAccount.token_uri || tokenUri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!tokenResponse.access_token) {
    throw new Error(`Token endpoint did not return access_token: ${JSON.stringify(tokenResponse)}`);
  }
  return tokenResponse.access_token;
}

function parseRangeA1(range) {
  const match = range.match(/^(?<sheet>[^!]+)!(?<startCol>[A-Z]+)(?<startRow>\d+):(?<endCol>[A-Z]+)(?<endRow>\d+)$/);
  if (!match?.groups) {
    throw new Error(`Unexpected A1 range format: ${range}`);
  }
  return {
    sheet: match.groups.sheet,
    startCol: match.groups.startCol,
    startRow: Number(match.groups.startRow),
    endCol: match.groups.endCol,
    endRow: Number(match.groups.endRow),
  };
}

async function main() {
  const serviceAccount = JSON.parse(await readFile(keyPath, 'utf8'));
  const accessToken = await getAccessToken(serviceAccount);

  const appendRange = `${tabName}!A:M`;
  const appendUrl = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(appendRange)}:append`,
  );
  appendUrl.searchParams.set('valueInputOption', 'RAW');
  appendUrl.searchParams.set('insertDataOption', 'INSERT_ROWS');
  appendUrl.searchParams.set('includeValuesInResponse', 'true');
  appendUrl.searchParams.set('responseValueRenderOption', 'UNFORMATTED_VALUE');
  appendUrl.searchParams.set('responseDateTimeRenderOption', 'FORMATTED_STRING');

  const appendResponse = await fetchJson(appendUrl, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      majorDimension: 'ROWS',
      values: events,
    }),
  });

  const updatedRange = appendResponse?.updates?.updatedRange;
  if (!updatedRange) {
    throw new Error(`Append response missing updates.updatedRange: ${JSON.stringify(appendResponse)}`);
  }

  const parsed = parseRangeA1(updatedRange);
  const verifyRange = `${parsed.sheet}!A${parsed.startRow}:M${parsed.endRow}`;
  const verifyUrl = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(verifyRange)}`,
  );
  verifyUrl.searchParams.set('majorDimension', 'ROWS');
  verifyUrl.searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE');
  verifyUrl.searchParams.set('dateTimeRenderOption', 'FORMATTED_STRING');

  const verifyResponse = await fetchJson(verifyUrl, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  const returnedRows = verifyResponse.values || [];

  if (returnedRows.length !== events.length) {
    throw new Error(
      `Verification row count mismatch for ${verifyRange}: expected ${events.length}, got ${returnedRows.length}`,
    );
  }

  for (let i = 0; i < events.length; i += 1) {
    const expected = events[i];
    const actual = returnedRows[i];
    const normalizedActual = Array.from({ length: expected.length }, (_, index) => actual?.[index] ?? '');
    const mismatchIndex = expected.findIndex((value, index) => String(value) !== String(normalizedActual[index]));
    if (mismatchIndex !== -1) {
      throw new Error(
        `Verification mismatch at row ${parsed.startRow + i}, column ${mismatchIndex + 1}.\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`,
      );
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        sheetId,
        tabName,
        updatedRange,
        verifiedRange: verifyRange,
        rowsWritten: events.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error));
  process.exit(1);
});

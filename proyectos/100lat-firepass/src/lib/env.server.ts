import 'server-only';

import { isConfigured, env, type EnvKey } from './env';

type ServerEnvKey =
  | 'N8N_WEBHOOK_URL'
  | 'PAYMENT_PROVIDER'
  | 'PAYMENT_PUBLIC_KEY'
  | 'PAYMENT_SECRET_KEY'
  | 'SUPABASE_SERVICE_ROLE_KEY';

const serverDefaults = {
  N8N_WEBHOOK_URL: '',
  PAYMENT_PROVIDER: '',
  PAYMENT_PUBLIC_KEY: '',
  PAYMENT_SECRET_KEY: '',
  SUPABASE_SERVICE_ROLE_KEY: '',
} as const;

const readServerEnv = (key: ServerEnvKey) => process.env[key] ?? serverDefaults[key];

export const serverEnv = {
  ...env,
  N8N_WEBHOOK_URL: readServerEnv('N8N_WEBHOOK_URL'),
  PAYMENT_PROVIDER: readServerEnv('PAYMENT_PROVIDER'),
  PAYMENT_PUBLIC_KEY: readServerEnv('PAYMENT_PUBLIC_KEY'),
  PAYMENT_SECRET_KEY: readServerEnv('PAYMENT_SECRET_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: readServerEnv('SUPABASE_SERVICE_ROLE_KEY'),
} as const;

export type ServerEnvKeyUnion = EnvKey | ServerEnvKey;

export function isServerConfigured(key: ServerEnvKeyUnion): boolean {
  return isConfigured(key as EnvKey) || (process.env[key as ServerEnvKey] ?? '') !== '';
}

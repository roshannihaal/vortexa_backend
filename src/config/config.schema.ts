import { z } from 'zod'

export const ConfigSchema = z.object({
  PORT: z.string().trim(),
  NODE_ENV: z.enum(['development', 'production']),
  RSA_BITS: z
    .string()
    .refine((value) => ['1024', '2048', '4096'].includes(value), {
      message: 'Invalid RSA_BITS value. Must be one of: 1024, 2048, 4096',
    })
    .transform((value) => parseInt(value, 10)),
  RSA_PASSPHRASE: z.string().trim(),
  POSTGRES_USER: z.string().trim(),
  POSTGRES_PASSWORD: z.string().trim(),
  POSTGRES_DB: z.string().trim(),
  JWT_SECRET: z.string().trim(),
  JWT_EXPIRES_IN: z.string().trim(),
  HASH_ROUNDS: z
    .string()
    .trim()
    .transform((value) => parseInt(value, 10)),
  REDIS_HOST: z.string().trim(),
  REDIS_EXPOSE_PORT: z.string().trim(),
  MAX_SESSIONS: z
    .string()
    .trim()
    .transform((value) => parseInt(value, 10)),
  TICTACTOE_PREFIX: z.string().trim(),
  ROOM_NAME_LENGTH: z
    .string()
    .trim()
    .transform((value) => parseInt(value, 10)),
})

export type ConfigSchema = z.input<typeof ConfigSchema>

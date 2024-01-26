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
})

export type ConfigSchema = z.input<typeof ConfigSchema>

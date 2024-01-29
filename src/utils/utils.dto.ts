import { z } from 'zod'

export const GenerateJwtTokenResponse = z.object({
  token: z.string().trim(),
  sessionId: z.string().trim(),
})
export type GenerateJwtTokenResponse = z.input<typeof GenerateJwtTokenResponse>

export const RedisSessionObject = z.object({
  userId: z.string().trim(),
  sessionId: z.string().trim(),
  tokenExpTime: z.number(),
})
export type RedisSessionObject = z.input<typeof RedisSessionObject>

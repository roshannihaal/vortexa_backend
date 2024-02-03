import { z } from 'zod'

export const GenerateJwtTokenResponse = z.object({
  token: z.string().trim(),
  sessionId: z.string().trim(),
})
export type GenerateJwtTokenResponse = z.input<typeof GenerateJwtTokenResponse>

export const RedisSessionObject = GenerateJwtTokenResponse.omit({
  sessionId: true,
}).array()
export type RedisSessionObject = z.input<typeof RedisSessionObject>

export const RedisSessionArray = z
  .object({
    token: z.string().trim(),
    key: z.string().trim(),
  })
  .array()
export type RedisSessionArray = z.input<typeof RedisSessionArray>

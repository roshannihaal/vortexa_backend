import { z } from 'zod'

export const generateJwtTokenResponse = z.object({
  token: z.string().trim(),
  sessionId: z.string().trim(),
})
export type generateJwtTokenResponse = z.input<typeof generateJwtTokenResponse>

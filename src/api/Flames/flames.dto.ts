import { z } from 'zod'

export const CalculateFlamesDTO = z.object({
  name1: z
    .string({
      required_error: 'name1 is required',
      invalid_type_error: 'name1 should be a string',
    })
    .trim()
    .refine((val) => /^[a-zA-Z\s]+$/.test(val), {
      message:
        'name1 should only contain letters (both lower and upper case) and whitespace',
    }),
  name2: z
    .string({
      required_error: 'name2 is required',
      invalid_type_error: 'name2 should be a string',
    })
    .trim()
    .refine((val) => /^[a-zA-Z\s]+$/.test(val), {
      message:
        'name2 should only contain letters (both lower and upper case) and whitespace',
    }),
})

export type CalculateFlamesDTO = z.input<typeof CalculateFlamesDTO>

import { z } from 'zod'

export const UserDTO = z.object({
  id: z.string(),
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username should be a string',
    })
    .trim(),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email should be a string',
    })
    .email()
    .trim(),
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name should be a string',
    })
    .trim(),
})
export type UserDTO = z.input<typeof UserDTO>

// Request
export const SignupDTO = UserDTO.omit({ id: true }).merge(
  z.object({
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password should be a string',
      })
      .min(8)
      .trim(),
    confirmPassword: z
      .string({
        required_error: 'Confirm password is required',
        invalid_type_error: 'Confirm password should be a string',
      })
      .min(8)
      .trim(),
  }),
)

export type SignupDTO = z.input<typeof SignupDTO>

export const LoginDTO = z.object({
  id: z
    .string({
      required_error: 'Username or Email id is required',
      invalid_type_error: 'Id should be a string',
    })
    .trim(),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password should be a string',
    })
    .min(8)
    .trim(),
})
export type LoginDTO = z.input<typeof LoginDTO>

// Responses
export const CheckAndCreateUserResponseDTO = z.object({
  created: z.boolean(),
  message: z.string(),
  user: UserDTO.optional(),
})
export type CheckAndCreateUserResponseDTO = z.input<
  typeof CheckAndCreateUserResponseDTO
>

export const CheckAndReturnUserResponseDTO = z.object({
  message: z.string(),
  authenticated: z.boolean(),
  accountExists: z.boolean(),
  user: UserDTO.optional(),
})
export type CheckAndReturnUserResponseDTO = z.input<
  typeof CheckAndReturnUserResponseDTO
>

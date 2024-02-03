import { z } from 'zod'

export const CreateRoomDTO = z.object({
  game: z.string().refine((value) => ['tictactoe'].includes(value), {
    message: 'game not found',
  }),
})
export type CreateRoomDTO = z.input<typeof CreateRoomDTO>

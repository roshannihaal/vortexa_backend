import { config } from '../../config'
import { doesGameRoomExists, createGameRoom } from '../../utils'

const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let randomString = ''

  for (let i = 0; i < config.ROOM_NAME_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomString += characters.charAt(randomIndex)
  }

  return randomString
}

export const createRoomService = async (roomPrefix: string) => {
  let isRoomAvailable: boolean = false
  let generatedName: string = ''
  while (isRoomAvailable === false) {
    generatedName = generateRandomString()
    const roomName = `${roomPrefix}_${generatedName}`
    isRoomAvailable = !(await doesGameRoomExists(roomName))
  }
  if (isRoomAvailable) {
    await createGameRoom(roomPrefix, generatedName)
  }
  return generatedName
}

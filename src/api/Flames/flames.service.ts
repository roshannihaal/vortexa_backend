import { prismaClient } from '../../utils'
import { FLAMES } from '@prisma/client'

export const getFlamesResult = (name1: string, name2: string) => {
  const flames = ['F', 'L', 'A', 'M', 'E', 'S']

  const flamesMap = new Map([
    ['F', 'FRIEND'],
    ['L', 'LOVER'],
    ['A', 'AFFECTION'],
    ['M', 'MARRIAGE'],
    ['E', 'ENEMY'],
    ['S', 'SIBLING'],
  ])

  let result: FLAMES = 'NO_RESULT'

  // Remove all whitespace
  name1 = name1.replace(/\s/g, '')
  name2 = name2.replace(/\s/g, '')

  // Convert to lower case
  name1 = name1.toLowerCase()
  name2 = name2.toLowerCase()

  // Convert to array
  const name1Array = name1.split('')
  const name2Array = name2.split('')

  // Remove all matching characters
  for (let i = 0; i < name1Array.length; i++) {
    for (let j = 0; j < name2Array.length; j++) {
      if (name2Array[j] === 'X') {
        continue
      }
      if (name1Array[i] === name2Array[j]) {
        name1Array[i] = 'X'
        name2Array[j] = 'X'
      }
    }
  }

  // Getting length of remaining characters
  const name1RemainingLength = name1Array.reduce(
    (acc, curr) => (curr === 'X' ? acc : acc + 1),
    0,
  )
  const name2RemainingLength = name2Array.reduce(
    (acc, curr) => (curr === 'X' ? acc : acc + 1),
    0,
  )

  // Getting total count
  let count = name1RemainingLength + name2RemainingLength

  if (count) {
    let index = 0
    let deleteCounter = 5

    // Get the unique letter
    while (deleteCounter) {
      if (flames[index] !== 'X') {
        if (--count === 0) {
          flames[index] = 'X'
          deleteCounter--
          count = name1RemainingLength + name2RemainingLength
        }
      }
      index = (index + 1) % 6
    }
    const uniqueLetter = flames.find((val) => val !== 'X')

    if (uniqueLetter) {
      result = flamesMap.get(uniqueLetter) as FLAMES
    }
  }
  return result
}

export const writeFlamesResult = async (
  userId: string,
  name1: string,
  name2: string,
  result: FLAMES,
) => {
  try {
    await prismaClient.flames_history.create({
      data: {
        user_id: userId,
        name1,
        name2,
        result,
      },
    })
  } catch (error) {
    throw error
  }
}

export const getFlamesHistory = async (
  userId: string,
  take: number,
  skip: number,
) => {
  try {
    const history = await prismaClient.flames_history.findMany({
      select: {
        name1: true,
        name2: true,
        result: true,
        createdAt: true,
      },
      take,
      skip,
      where: {
        user_id: userId,
      },
    })
    return history
  } catch (error) {
    throw error
  }
}

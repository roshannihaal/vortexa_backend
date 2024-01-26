import { generateKeyPair } from 'node:crypto'
import * as fs from 'node:fs'
import { config } from '../config'
import path from 'node:path'

const keysFolder = path.resolve('./keys')
const privateKeyPath = `${keysFolder}/private-key.pem`
const publicKeyPath = `${keysFolder}/public-key.pem`

const isFileExist = (path: string) => {
  const isExist = fs.existsSync(path)
  return isExist
}

const doesRSAKeysExist = () => {
  return isFileExist(privateKeyPath) && isFileExist(publicKeyPath)
}

export const generateRSAKeys = () => {
  if (!doesRSAKeysExist()) {
    if (isFileExist(publicKeyPath)) {
      fs.unlinkSync(publicKeyPath)
    }
    if (isFileExist(privateKeyPath)) {
      fs.unlinkSync(privateKeyPath)
    }

    const rsa_bits = config.RSA_BITS
    const rsa_passphrase = config.RSA_PASSPHRASE

    generateKeyPair(
      'rsa',
      {
        modulusLength: rsa_bits,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: rsa_passphrase,
        },
      },
      (error, publicKey, privateKey) => {
        if (error) {
          console.error(`Error while generating RSA Keys: ${error}`)
          return
        }
        writeRSAFiles(publicKey, privateKey)
      },
    )
  }
}

const writeRSAFiles = (publicKey: string, privateKey: string) => {
  try {
    fs.writeFileSync(publicKeyPath, publicKey)
    fs.writeFileSync(privateKeyPath, privateKey)
  } catch (error) {
    console.error(`Error while writing RSA files: ${error}`)
  }
}

const readFile = (path: string) => {
  const file = fs.readFileSync(path, 'utf-8')
  return file
}

export const getPublicKey = () => {
  const publicKey = readFile(publicKeyPath)
  return publicKey
}

export const getPrivateKey = () => {
  const privateKey = readFile(privateKeyPath)
  return privateKey
}

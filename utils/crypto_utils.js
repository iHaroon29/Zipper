import crypto from 'crypto'

const generateRandom = async () => {
  return crypto.randomBytes(10).toString('hex')
}

export { generateRandom }

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const generateToken = async (data) => {
  try {
    return jwt.sign({ data }, process.env.secret)
  } catch (e) {
    return e
  }
}

const verifyToken = async (token) => {
  try {
    jwt.verify(token, process.env.secret)
    return { valid: true, message: 'OK' }
  } catch (e) {
    return e
  }
}

const decodeToken = async (token) => {
  try {
    return jwt.decode(token, { json: true })
  } catch (e) {
    return e
  }
}

export { generateToken, verifyToken, decodeToken }

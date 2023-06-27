import multer from 'multer'
import { decodeToken } from './jwt_utils.js'
import path from 'path'
import fs from 'fs'

const filterFile = async (req, file, cb) => {
  try {
    const ext = path.extname(file.originalname)
    if (
      ext !== '.png' &&
      ext !== '.jpg' &&
      ext !== '.jpeg' &&
      ext !== '.pdf' &&
      ext !== '.txt'
    ) {
      return cb(new Error('Invalid File Extension'))
    }
    cb(null, true)
  } catch (e) {
    console.log(e.message)
  }
}

const initMulter = () => {
  try {
    const validateFolder = async (token) => {
      const tokenData = await decodeToken(token)
      if (!fs.existsSync(`./temp/uploads/${tokenData.data}`)) {
        fs.mkdirSync(`./temp/uploads/${tokenData.data}`)
      }
      return tokenData
    }
    const instance = multer.diskStorage({
      destination: async (req, file, cb) => {
        const { token } = req.cookies
        const tokenData = await validateFolder(token)
        cb(null, `./temp/uploads/${tokenData.data}`)
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname)
      },
    })
    return instance
  } catch (e) {
    console.log(e.message)
  }
}

export { initMulter, filterFile }

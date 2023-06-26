import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { decodeToken } from './jwt_utils.js'

const readFile = async () => {
  try {
  } catch (e) {
    console.log(e.message)
  }
}

const writeFile = async () => {
  try {
  } catch (e) {
    console.log(e.message)
  }
}

const deleteFile = async (path) => {
  try {
    if (!fs.existsSync(path)) throw new Error('File Does Not exists!')
    return fs.rm(path, (err) => {
      if (err) throw new Error(`File Missing Error - ${path}`)
      console.log(`${path} has been deleted!`)
    })
  } catch (e) {
    return e
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

const filterFile = async (req, file, cb) => {
  try {
    const ext = path.extname(file.originalname)
    if (
      ext !== '.png' &&
      ext !== '.jpg' &&
      ext !== '.gif' &&
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

const updateFileName = async () => {
  try {
  } catch (e) {
    console.log(e.message)
  }
}

export {
  readFile,
  writeFile,
  deleteFile,
  updateFileName,
  initMulter,
  filterFile,
}

import fs from 'fs'
import crypto from 'crypto'
import { writeFile } from '../utils/fs_utils.js'
import {
  initiateZipInstance,
  appendFileToArchive,
  generateZipFile,
} from '../utils/zipper_utils.js'

const testGenerate = async (req, res, next) => {
  try {
    if (!fs.existsSync('./test.txt')) {
      writeFile(
        './test.txt',
        crypto
          .randomBytes(1024 * 1024 * Math.floor(Math.random() * 5))
          .toString('hex')
      )
    }
    const zipInstance = await initiateZipInstance()
    await appendFileToArchive(zipInstance, `./test.txt`, 'test')
    await generateZipFile(zipInstance, fs.createWriteStream(`./test.zip`))
    res.status(200).send({ message: 'OK' })
  } catch (e) {
    next(e)
  }
}

const testVitals = async (req, res, next) => {
  try {
    const fileSize = fs.statSync('./test.txt', { throwIfNoEntry: true }).size
    const zipSize = fs.statSync('./test.zip', { throwIfNoEntry: true }).size
    return res.status(200).send({
      message: 'OK',
      fileSize: fileSize / (1024 * 1024) + 'mb',
      zipSize: zipSize / (1024 * 1024) + 'mb',
    })
  } catch (e) {
    next(e)
  }
}

const testDelete = async (req, res, next) => {
  try {
    fs.rm('./test.zip', (e) => {
      if (e) next(e)
      console.log('Zip Deleted')
    })
    fs.rm('./test.txt', (e) => {
      if (e) next(e)
      console.log('File Deleted')
    })
    res.status(200).send({ message: 'OK' })
  } catch (e) {
    next(e)
  }
}

const testDownload = async (req, res, next) => {
  try {
    res.download('./test.zip', (e) => {
      if (e) next(e)
    })
  } catch (e) {
    next(e)
  }
}

const cleanup = async (req, res, next) => {
  try {
    fs.readdir('./temp/downloads', { recursive: true }, (e, files) => {
      if (e) throw e
      for (let file of files) {
        fs.rm(`./temp/downloads/${file}`, { recursive: true }, (e) => {
          if (e) throw e
        })
      }
      console.log('Finished-Downloads')
    })
    fs.readdir('./temp/uploads', { recursive: true }, (e, files) => {
      if (e) throw e
      for (let file of files) {
        fs.rm(`./temp/uploads/${file}`, { recursive: true }, (e) => {
          if (e) throw e
        })
      }
      console.log('Finished-Uploads')
    })
    res.status(200).send('OK')
  } catch (e) {
    next(e)
  }
}

export { testGenerate, testDownload, testVitals, testDelete, cleanup }

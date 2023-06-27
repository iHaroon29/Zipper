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
    if (!fs.existsSync('./test.zip')) {
      throw new Error('Zip File not created!')
    }
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
      fileSize: fileSize / (1024 * 1024),
      zipSize: zipSize / (1024 * 1024),
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
  res.download('./test.zip', (e) => {
    if (e) next(e)
  })
}

export { testGenerate, testDownload, testVitals, testDelete }

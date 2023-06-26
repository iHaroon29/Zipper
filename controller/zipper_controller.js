import fs from 'fs'
import { decodeToken } from '../utils/jwt_utils.js'
import {
  appendFileToArchive,
  generateZipFile,
  initiateZipInstance,
} from '../utils/zipper_utils.js'
import { deleteFile } from '../utils/fs_utils.js'
import { generateRandom } from '../utils/crypto_utils.js'

const compressSingle = async (req, res, next) => {
  try {
    const { flag } = req.query
    const zipInstance = await initiateZipInstance()
    const fileName = await generateRandom()
    const path = req.file.path.split('\\').slice(-1)[0]
    const tokenResp = await decodeToken(req.cookies.token)
    if (tokenResp instanceof Error) throw tokenResp
    await appendFileToArchive(
      zipInstance,
      `./temp/uploads/${tokenResp.data}/${path}`,
      path
    )
    await generateZipFile(
      zipInstance,
      fs.createWriteStream(`./temp/downloads/${fileName}.zip`)
    )
    if (flag) {
      const resp = await deleteFile(`./temp/uploads/${tokenResp.data}/${path}`)
      if (resp instanceof Error) throw resp
    }
    res.status(200).send({
      fileName: `${fileName}.zip`,
      accessPoint: `http://localhost:8000/files?fileName=${fileName}.zip`,
    })
  } catch (e) {
    return next(e)
  }
}

const compressAll = async (req, res, next) => {
  try {
    const { flag } = req.query
    const zipInstance = await initiateZipInstance()
    const fileName = await generateRandom()
    const { data } = await decodeToken(req.cookies.token)
    for (let file of req.files) {
      const path = file.path.split('\\').slice(-1)[0]
      await appendFileToArchive(
        zipInstance,
        `./temp/uploads/${data}/${path}`,
        path
      )
    }
    await generateZipFile(
      zipInstance,
      fs.createWriteStream(`./temp/downloads/${fileName}.zip`),
      9
    )
    if (flag) {
      for (let file of req.files) {
        const path = file.path.split('\\').slice(-1)[0]
        const resp = await deleteFile(path)
        if (resp instanceof Error) throw resp
      }
    }
    res.status(200).send({
      fileName: `${fileName}.zip`,
      accessPoint: `http://localhost:8000/files?fileName=${fileName}.zip`,
    })
  } catch (e) {
    return next(e)
  }
}

const decompressSingle = async (req, res, next) => {
  try {
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
}

const decompressAll = async (req, res, next) => {
  try {
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
}

export { compressSingle, compressAll, decompressSingle, decompressAll }

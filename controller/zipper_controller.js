import fs from 'fs'
import { decodeToken } from '../utils/jwt_utils.js'
import {
  appendFileToArchive,
  generateZipFile,
  initiateZipInstance,
  decompressZip,
} from '../utils/zipper_utils.js'
import { deleteFile } from '../utils/fs_utils.js'
import { generateRandom } from '../utils/crypto_utils.js'

const compress = async (req, res, next) => {
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
    if (!fs.existsSync(`./temp/downloads/${data}`)) {
      fs.mkdirSync(`./temp/downloads/${data}`)
    }
    await generateZipFile(
      zipInstance,
      fs.createWriteStream(`./temp/downloads/${data}/${fileName}.zip`),
      9
    )

    if (flag === 'true') {
      for (let file of req.files) {
        const path = file.path.split('\\').slice(-1)[0]
        const resp = await deleteFile(`./temp/uploads/${data}/${path}`)
        if (resp instanceof Error) throw resp
      }
    }
    res.status(200).send({
      fileName: `${fileName}.zip`,
    })
  } catch (e) {
    return next(e)
  }
}

const decompress = async (req, res, next) => {
  try {
    const { passwordProtected } = req.query
    const fileName = req.file.filename.split('.')[0]
    const { data } = await decodeToken(req.cookies.token)
    const paths = await decompressZip(
      req.file.path,
      `./temp/downloads/${data}/${fileName}`,
      passwordProtected
    )
    res.status(200).send({ paths })
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
}

export { compress, decompress }

import { deleteFile } from '../utils/fs_utils.js'
import { decodeToken } from '../utils/jwt_utils.js'

const downloadFile = async (req, res, next) => {
  try {
    const { filename, flag } = req.query
    const { data } = await decodeToken(req.cookies.token)
    res.download(`./temp/downloads/${filename}`, async (e) => {
      if (e) next(e)
      if (flag && flag === 'true') {
        const data = await deleteFile(`./temp/downloads/${data}/${filename}`)
        if (data instanceof Error) next(data)
      }
    })
  } catch (e) {
    next(e)
  }
}

export { downloadFile }

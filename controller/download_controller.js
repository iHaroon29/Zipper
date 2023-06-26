import { deleteFile } from '../utils/fs_utils.js'

const downloadFile = async (req, res, next) => {
  try {
    const { fileName, flag } = req.query
    res.download(`./temp/downloads/${fileName}`, async (e) => {
      if (e) next(e)
      if (!flag) return
      const data = await deleteFile(`./temp/downloads/${fileName}`)
      if (data instanceof Error) next(data)
    })
  } catch (e) {
    next(e)
  }
}

export { downloadFile }

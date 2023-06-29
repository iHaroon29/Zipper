import { deleteFile } from '../utils/fs_utils.js'

const downloadFile = async (req, res, next) => {
  try {
    const { filename, flag } = req.query
    res.download(`./temp/downloads/${filename}`, async (e) => {
      if (e) next(e)
      if (!Boolean(flag)) return
      const data = await deleteFile(`./temp/downloads/${filename}`)
      if (data instanceof Error) next(data)
    })
  } catch (e) {
    next(e)
  }
}

export { downloadFile }

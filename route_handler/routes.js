import { Router } from 'express'
import multer from 'multer'
import { initMulter, filterFile } from '../utils/fs_utils.js'
import { compressSingle, compressAll } from '../controller/zipper_controller.js'
import { authenticateUser, verifyUser } from '../controller/auth_controller.js'
import { downloadFile } from '../controller/download_controller.js'

const upload = multer({
  storage: initMulter(),
  fileFilter: async (req, file, cb) => await filterFile(req, file, cb),
  limits: {
    fileSize: 1024 * 1024,
  },
})

const router = Router()

router.route('/token').get(authenticateUser)
router
  .route('/compress?')
  .post(verifyUser, upload.single('upload'), compressSingle)
router
  .route('/compress/all')
  .post(verifyUser, upload.array('upload', 10), compressAll)
router.route('/files?').get(downloadFile)

export default router

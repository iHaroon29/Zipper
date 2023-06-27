import { Router } from 'express'
import multer from 'multer'
import { initMulter, filterFile } from '../utils/multer_utils.js'
import { compressSingle, compressAll } from '../controller/zipper_controller.js'
import { authenticateUser, verifyUser } from '../controller/auth_controller.js'
import { downloadFile } from '../controller/download_controller.js'
import {
  testGenerate,
  testDownload,
  testVitals,
  testDelete,
} from '../controller/test_controller.js'

const upload = multer({
  storage: initMulter(),
  fileFilter: async (req, file, cb) => await filterFile(req, file, cb),
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
})

const router = Router()

router.route('/ping').get((req, res, next) => res.status(200))
router.route('/token').get(authenticateUser)
router
  .route('/compress?')
  .post(verifyUser, upload.single('upload'), compressSingle)
router
  .route('/compress/all')
  .post(verifyUser, upload.array('upload', 10), compressAll)
router.route('/files?').get(downloadFile)
router.route('/test/generate').get(testGenerate)
router.route('/test/vitals').get(testVitals)
router.route('/test/download').get(testDownload)
router.route('/test/delete').delete(testDelete)

export default router

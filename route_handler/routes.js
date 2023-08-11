import { Router } from 'express'
import multer from 'multer'
import { initMulter, filterFile } from '../utils/multer_utils.js'
import { compress, decompress } from '../controller/zipper_controller.js'
import { authenticateUser, verifyUser } from '../controller/auth_controller.js'
import { downloadFile } from '../controller/download_controller.js'
import {
  testGenerate,
  testDownload,
  testVitals,
  testDelete,
  cleanup,
} from '../controller/test_controller.js'

// Multer Config
const upload = multer({
  storage: initMulter(),
  fileFilter: async (req, file, cb) => await filterFile(req, file, cb),
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
})

// Router Instansiation
const router = Router()

// Zipper API
router.route('/ping').get((req, res, next) => res.status(200).send('OK'))
router.route('/token').get(authenticateUser)
router.route('/clean').get(cleanup)
router
  .route('/compress')
  .post(verifyUser, upload.array('upload-compress', 10), compress)
router
  .route('/decompress')
  .post(verifyUser, upload.single('upload-decompress'), decompress)
router.route('/files?').get(downloadFile)

// Test API
router.route('/test/generate').get(testGenerate)
router.route('/test/vitals').get(testVitals)
router.route('/test/download').get(testDownload)
router.route('/test/delete').delete(testDelete)
export default router

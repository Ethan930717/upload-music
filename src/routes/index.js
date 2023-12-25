import Router from 'koa-router';
import UploadController from '../controllers/UploadController.js';
const newUploadController = new UploadController()
const router = new Router()
router.post('/upload', newUploadController.index);

export default router

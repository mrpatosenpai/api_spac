import { Router } from 'express';
import infoController from '../controllers/infoController.js';

const router = Router();

router.get('/usuarios', infoController.index);
router.post('/usuarios/register', infoController.store);
router.get('/usuarios/:id', infoController.details);

router.post('/diarios', infoController.addDiaryEntry);
router.post('/escanerFacial', infoController.addScannerResult);

router.post('/publicaciones', infoController.createPost);
router.get('/publicaciones', infoController.getPosts);
router.post('/usuarios/login', infoController.login)
router.get('/publicaciones/:usuario_id', infoController.getUserPosts);
router.post('/usuarios/nuevaEntrada', infoController.nuevaEntrada);

export default router;

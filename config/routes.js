import { Router } from 'express';
import infoController from '../controllers/infoController.js';

const router = Router();

router.get('/usuarios', infoController.index);
router.post('/usuarios/register', infoController.store);
router.get('/usuarios/:id', infoController.details);

router.post('/escanerFacial', infoController.addScannerResult);

router.post('/crear/publicaciones', infoController.createPost);
router.get('/tomar/publicaciones', infoController.getPosts);
router.post('/usuarios/login', infoController.login);
router.get('/publicaciones/:usuario_id', infoController.getUserPosts);
router.post('/usuarios/nuevaEntrada', infoController.nuevaEntrada);
router.get('/usuarios/entradas',infoController.misentradas);

export default router;

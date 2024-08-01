import { Router } from 'express';
import infoController from '../controllers/infoController.js';

const router = Router();

// Rutas existentes
router.get('/usuarios', infoController.index);
router.post('/usuarios/register', infoController.store);
router.get('/usuarios/:id', infoController.details);
router.post('/escanerFacial', infoController.addScannerResult);
router.post('/crear/publicaciones', infoController.createPost);
router.get('/tomar/publicaciones', infoController.getPosts);
router.post('/usuarios/login', infoController.login);
router.get('/publicaciones/:usuario_id', infoController.getUserPosts);
router.post('/usuarios/nuevaEntrada', infoController.nuevaEntrada);
router.get('/usuarios/entradas', infoController.misentradas);

// Nueva ruta para testSession
router.get('/usuarios/test', infoController.testSession);

export default router;
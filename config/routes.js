import { Router } from 'express';
import infoController from '../controllers/infoController.js';

const routes = Router();

// Rutas existentes
routes.get('/usuarios', infoController.index);
routes.post('/usuarios/register', infoController.store);
routes.get('/usuarios/:id', infoController.details);
routes.post('/escanerFacial', infoController.addScannerResult);
routes.post('/crear/publicaciones', infoController.createPost);
routes.get('/tomar/publicaciones', infoController.getPosts);
routes.post('/usuarios/login', infoController.login);
routes.get('/publicaciones/:usuario_id', infoController.getUserPosts);
routes.post('/usuarios/nuevaEntrada', infoController.nuevaEntrada);
routes.get('/usuarios/entradas', infoController.misentradas);

// Nueva ruta para testSession
routes.get('/usuarios/test', infoController.testSession);

export default routes;
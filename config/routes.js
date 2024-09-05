import { Router } from 'express';
import infoController from '../controllers/infoController.js';

const routes = Router();

// Rutas existentes
routes.get('/usuarios', infoController.index);
routes.post('/usuarios/register', infoController.store);
routes.post('/crear/publicaciones', infoController.createPost);
routes.get('/tomar/publicaciones', infoController.getPosts);
routes.post('/usuarios/login', infoController.login);
routes.post('/usuarios/nuevaEntrada', infoController.nuevaEntrada);
routes.get('/usuarios/entradas', infoController.misentradas);
routes.get('/usuarios/misdatos',infoController.misdatos)
routes.get('/usuarios/racha', infoController.obtenerRacha);
routes.post('/logout', infoController.logout);
routes.get('/usuarios/:id', infoController.obtenerUsuario);
routes.put('/usuariosedit/:id', infoController.actualizarUsuario);

// Nueva ruta para testSession
routes.get('/usuarios/test', infoController.testSession);



export default routes;
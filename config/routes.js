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

// Nueva ruta para testSession
routes.get('/usuarios/test', infoController.testSession);

routes.get('/some-route', (req, res) => {
    if (req.session.userId && req.session.userName) {
        res.json({
            userId: req.session.userId,
            userName: req.session.userName
        });
    } else {
        res.status(401).json({ error: 'Usuario no autenticado' });
    }
});

routes.get('/protected', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    res.json({ message: 'Acceso permitido', user: req.session.userName });
});

routes.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.json({ message: 'Sesión cerrada exitosamente' });
    });
});

export default routes;
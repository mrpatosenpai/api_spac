import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './config/routes.js';
import memorystore from 'memorystore';

const MemoryStore = memorystore(session);
const app = express();

// Configuración de la sesión
app.use(session({
    store: new MemoryStore({
        checkPeriod: 86400000 // Revisar periódicamente para limpiar sesiones expiradas
    }),
    secret: 'crisvalencia456',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400000, // 24 horas
        secure: true, // Debe ser true para HTTPS
        httpOnly: true,
        sameSite: 'None',
    }
}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Configuración de CORS
const corsOptions = {
    origin: 'https://apispac-production.up.railway.app', // Asegúrate de que coincida con el origen de tu cliente
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Permite el envío de cookies
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rutas principales
app.use('/api', routes);

// Ruta de prueba para verificar la sesión
app.get('/api/usuarios/test', (req, res) => {
    console.log('Session on test route:', req.session);
    res.json(req.session);
});

// Ruta principal
app.get('/', (req, res) => res.send('Bienvenidos a mi API :D'));

const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Servidor corriendo en puerto: ${server.address().port}`);
});

export default app;
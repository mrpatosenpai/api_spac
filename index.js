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
        secure: true // Cambia a true si estás utilizando HTTPS
    }
}));

// Configuración de CORS
const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions)); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);

app.get('/', (req, res) => res.send('Bienvenidos a mi API :D'));

const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Servidor corriendo en puerto: ${server.address().port}`);
});

export default app;
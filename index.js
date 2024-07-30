import express from 'express';
import session from 'express-session';
import MySQLStore from 'express-mysql-session'; // Importa MySQLStore correctamente
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise'; // Importa mysql2
import db from './config/database.js';
import routes from './config/routes.js';

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: '*', // Cambia esto por tu dominio de frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Habilita el soporte de cookies
};

// Configuración de la sesión
const sessionStore = new MySQLStore({
    expiration: 86400000, // Tiempo de expiración en milisegundos (1 día)
    createDatabaseTable: true,
}, mysql.createPool(db));

app.use(session({
    secret: 'crisvalencia456',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // 'true' en producción (HTTPS) y 'false' en desarrollo (HTTP)
        httpOnly: true,
        sameSite: 'lax' // Ajusta esto según sea necesario
    }
}));

// Configuración del middleware
app.use(cors(corsOptions)); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);

app.get('/', (req, res) => res.send('Bienvenidos a mi API :D'));

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Servidor corriendo en puerto: ${server.address().port}`);
});

export default app;
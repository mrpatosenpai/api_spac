import express from 'express';
import session from 'express-session';
import MySQLStore from 'express-mysql-session'; // Asegúrate de que esto esté importado correctamente
import mysql from 'mysql2/promise';
import db from './config/database.js'; // Ajusta la ruta a tu archivo de configuración
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

// Configuración del almacenamiento de sesiones
const sessionStore = new MySQLStore({}, mysql.createPool(db));

app.use(session({
    secret: 'crisvalencia456',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Configuración de CORS
const corsOptions = {
    origin: '*', // Cambia esto según tu configuración
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);

app.get('/', (req, res) => res.send('Bienvenidos a mi API :D'));

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Servidor corriendo en puerto: ${server.address().port}`);
});

export default app;
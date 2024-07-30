import express from 'express';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './config/routes.js';

const app = express();

app.use(session({
    secret: 'crisvalencia456',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Usa 'true' si estás en producción y tu app usa HTTPS
        httpOnly: true,
        sameSite: 'lax' // Cambia según sea necesario
    },
    store: new MySQLStore({
        expiration: 86400000, // Tiempo de expiración en milisegundos (1 día)
        createDatabaseTable: true,
    }, mysql.createPool(db))
}))

const corsOptions = {
    origin: '*', // Cambia esto por tu dominio o usa '*' para desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Habilita el soporte de cookies
};

// Configuración del middleware
app.use(cors(corsOptions)); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);

app.get('/', (req, res) => res.send('Bienvenidos a mi API :D'));

const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Servidor corriendo en puerto: ${server.address().port}`);
});

export default app;
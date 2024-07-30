import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './config/routes.js';
import mysql from 'mysql2/promise';
import MySQLStore from 'express-mysql-session';
import db from './config/database.js';

const app = express();


const connection = await mysql.createConnection(db);
const sessionStore = new MySQLStore({}, connection);

const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(session({
    store: sessionStore,
    secret: 'crisvalencia456',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
}));

app.use(cors(corsOptions)); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);

app.get('/', (req, res) => res.send('Bienvenidos a mi API :D'));

const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Servidor corriendo en puerto: ${server.address().port}`);
});

export default app;
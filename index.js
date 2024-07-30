import express from 'express';
import session from 'express-session';
import FileStore from 'session-file-store';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './config/routes.js';

const app = express();
const FileStoreInstance = FileStore(session);
// Configuración de CORS
const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
};

// Configuración de la sesión
app.use(session({
    store: new FileStoreInstance(),
    secret: 'crisvalencia456',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } 
}));

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
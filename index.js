import express from 'express';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();


app.use(session({
    secret: 'crisvalencia456',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// Configuración de CORS
const corsOptions = {
    origin: '*', // Cambia esto según tu configuración
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
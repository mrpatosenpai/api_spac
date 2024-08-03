import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './config/routes.js';

// Configurar el cliente Redis
const redisClient = createClient({
    password: 'hJxxVGvuJawGmHhgA490N9zCu9EyFJPO',
    socket: {
        host: 'redis-10703.c323.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 10703
    }
});

// Manejar errores de conexión a Redis
redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Conectar a Redis
        await redisClient.connect();
        
        // Configurar el middleware de sesión con Redis
        const sesionmiddleware = session({
            store: new RedisStore({ client: redisClient }),
            secret: 'crisvalencia456',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 // 24 horas
            }
        });

        const app = express();

        // Middleware para parsear el cuerpo de las peticiones
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        // Configuración de CORS
        const corsOptions = {
            origin: 'https://apispac-production.up.railway.app',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true // Permite el envío de cookies
        };

        app.use(cors(corsOptions));

        // Configurar las sesiones con Redis
        app.use(sesionmiddleware);

        app.use((req, res, next) => {
            console.log(`${req.method} ${req.url}`);
            next();
        });

        app.use('/api', routes);

        app.get('/', (req, res) => res.send('Bienvenidos a mi API :D yuju'));

        const server = app.listen(process.env.PORT || 8000, () => {
            console.log(`Servidor corriendo en puerto: ${server.address().port}`);
        });

        // Exportar la instancia de `app`
        return app;

    } catch (err) {
        console.error('Error al iniciar el servidor:', err);
    }
};

// Iniciar el servidor
startServer();
import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './config/routes.js';

// Función principal para configurar el servidor
async function startServer() {
    // Configurar el cliente Redis
    const redisClient = createClient({
      url: 'redis://default:hJxxVGvuJawGmHhgA490N9zCu9EyFJPO@redis-10703.c323.us-east-1-2.ec2.redns.redis-cloud.com:10703',
        legacyMode: false
    });

    // Manejar errores de conexión a Redis
    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    // Conectar a Redis
    try {
        await redisClient.connect();
        console.log('Conectado a Redis');

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


    } catch (err) {
        console.error('Error al conectar a Redis:', err);
        process.exit(1); // Salir con error
    }
}

// Llamar a la función para iniciar el servidor
startServer();
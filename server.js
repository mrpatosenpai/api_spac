import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './config/routes'; 

const RedisStore = connectRedis(session);

// Configurar el cliente Redis
const client = createClient({
    password: 'hJxxVGvuJawGmHhgA490N9zCu9EyFJPO',
    socket: {
        host: 'redis-10703.c323.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 10703
    }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

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
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'crisvalencia456', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.use('/api', router);


app.get('/', (req, res) => res.send('Bienvenidos a mi API :D yuju'));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Servidor corriendo en puerto: ${server.address().port}`);
});

export default app;
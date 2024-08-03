import express from 'express';
import session from 'express-session';
import db from './config/database.js';
import cron from 'node-cron'
import SequelizeStore  from'connect-session-sequelize';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './config/routes.js';

const app = express();

// Configuración de la base de datos con Sequelize



// Inicializar Sequelize Store
const SessionStore = SequelizeStore(session.Store);
const sequelizeStore = new SessionStore({
  db: db,
});

// Middleware para parsear el cuerpo de las peticiones
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de CORS
const corsOptions = {
  origin: 'https://apispac-production.up.railway.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permite el envío de cookies
};

app.use(cors(corsOptions));

// Configurar las sesiones con Sequelize
app.use(
  session({
    secret: 'crisvalencia456',
    store: sequelizeStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
    },
  })
);

sequelizeStore.sync();

// Rutas y lógica del servidor
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

cron.schedule('0 0 * * *', () => {
  sequelizeStore.sessionModel.destroy({
    where: {
      expires: {
        [Sequelize.Op.lt]: new Date(),
      },
    },
  }).then(() => {
    console.log('Sesiones expiradas eliminadas');
  }).catch((err) => {
    console.error('Error al eliminar sesiones expiradas:', err);
  });
});

app.use('/api', routes);

app.get('/', (req, res) => res.send('Bienvenidos a mi API :D yuju'));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Servidor corriendo en puerto: ${server.address().port}`);
});

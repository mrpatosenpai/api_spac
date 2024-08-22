import mysql from 'mysql2/promise';
import db from '../config/database.js';


export default class infoController {
    
    static async login(req, res) {
        let connection;
        try {
            const { nombre, contrasena } = req.body;
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute(
                "SELECT * FROM usuarios WHERE nombre = ? AND contrasena = ?",
                [nombre, contrasena]
            );
    
            if (result.length > 0) {
                req.session.userId = result[0].id;
                req.session.userName = result[1].nombre;

                // Lógica para la racha
                const userId = result[0].id;
                const [rachaResult] = await connection.execute(
                    "SELECT * FROM racha WHERE usuario_id = ?",
                    [userId]
                );

                const today = new Date();
                const todayDateString = today.toISOString().split('T')[0];

                if (rachaResult.length > 0) {
                    const ultimaConexion = new Date(rachaResult[0].ultima_conexion);
                    const diasDiferencia = Math.floor((today - ultimaConexion) / (1000 * 60 * 60 * 24));

                    if (diasDiferencia === 1) {
                        // Aumentar la racha si es el día siguiente
                        await connection.execute(
                            "UPDATE racha SET racha_actual = racha_actual + 1, ultima_fecha_login = ? WHERE usuario_id = ?",
                            [todayDateString, userId]
                        );
                    } else if (diasDiferencia > 1) {
                        // Resetear la racha si ha pasado más de un día
                        await connection.execute(
                            "UPDATE racha SET racha_actual = 1, ultima_fecha_login = ? WHERE usuario_id = ?",
                            [todayDateString, userId]
                        );
                    }
                    // Si la diferencia es 0 (mismo día), no hacer nada.
                } else {
                    // Crear un nuevo registro de racha si no existe
                    await connection.execute(
                        "INSERT INTO racha (usuario_id, racha_actual, ultima_fecha_login) VALUES (?, 1, ?)",
                        [userId, todayDateString]
                    );
                }

                console.log('Session UserID after login:', req.session.userId);
                console.log('Session UserName after login:', req.session.userName);
                res.json({ userId: result[0].id, userName: result[1].nombre });
            } else {
                res.status(401).json({ error: 'Credenciales incorrectas' });
            }
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
    static async obtenerRacha(req, res) {
        let connection;
        try {
            const userId = req.session.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }
    
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute(
                "SELECT racha_actual FROM racha WHERE usuario_id = ?",
                [userId]
            );
    
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.json({ racha_actual: 0 });
            }
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async testSession(req, res) {
        console.log('Session on test route:', req.session);
        res.json(req.session);
    }
    static async index(req, res) {
        let connection;
        try {
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute("SELECT * FROM usuarios");
            console.log(result);
            res.json(result);
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    };

    static async store(req, res) {
        let connection;

        try {
            const { nombre, email, contrasena, edad } = req.body;
            connection = await mysql.createConnection(db);

            // Verificar si el nombre de usuario ya existe
            const [existingUser] = await connection.execute("SELECT * FROM usuarios WHERE nombre = ?", [nombre]);
            if (existingUser.length > 0) {
                return res.status(400).json({ error: "El nombre de usuario ya está registrado" });
            }else{
                        // Insertar nuevo usuario
            const [result] = await connection.execute("INSERT INTO usuarios (nombre, email, contrasena, edad) VALUES (?, ?, ?, ?)", [nombre, email, contrasena, edad]);
            console.log(result);
            res.json({ message: "Usuario registrado exitosamente", insertId: result.insertId });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    };

    static async createPost(req, res) {
        let connection;
        try {
            const { contenido } = req.body;
            const usuarioId = req.session.userId;
            const nombreUsuario = req.session.userName; // Obtener el nombre del usuario de la sesión
    
            // Validar que el contenido esté definido
            if (typeof contenido === 'undefined') {
                return res.status(400).json({ 'error': 'Contenido es requerido' });
            }
    
            if (!usuarioId || !nombreUsuario) {
                return res.status(401).json({ 'error': 'Usuario no autenticado' });
            }
    
            console.log('Contenido:', contenido);
            console.log('Usuario ID:', usuarioId);
            console.log('Nombre Usuario:', nombreUsuario);
    
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute(
                "INSERT INTO publicaciones (contenido, fecha, usuario_id, nombre_usuario) VALUES (?, NOW(), ?, ?)",
                [contenido, usuarioId, nombreUsuario] // Pasar el nombre del usuario
            );
    
            console.log(result);
            res.json(result);
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
    
      
    static async getPosts(req, res) {
        let connection;
        try {
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute("SELECT * FROM publicaciones");
            console.log(result);
            res.json(result);
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    };

    static async misentradas(req, res) {
        console.log('Entrando en MisEntradas...');
        const usuarioId = req.session.userId; // Obtiene el ID del usuario desde la sesión
        console.log('Session UserID in entradas:', usuarioId);
    
        if (!usuarioId) {
            console.log('Usuario no autenticado');
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
    
        let connection;
        try {
            console.log('Intentando conectar a la base de datos...');
            connection = await mysql.createConnection(db);
            console.log('Conexión a la base de datos establecida.');
    
            console.log('Ejecutando consulta de entradas...');
            // Busca las entradas usando el ID del usuario y formatea la fecha y hora
            const [result] = await connection.execute(
                `SELECT *, DATE_FORMAT(fecha_hora, '%Y-%m-%d') AS fecha_formateada, 
                        DATE_FORMAT(fecha_hora, '%H:%i') AS hora_formateada 
                 FROM diarios 
                 WHERE usuario_id = ?`, [usuarioId]
            );
    
            console.log('Resultado de la consulta de entradas:', result);
    
            if (result.length === 0) {
                console.log('No se encontraron entradas para el usuario.');
                return res.status(404).json({ message: 'No se encontraron entradas' });
            }
    
            // Formatea el resultado para incluir solo la fecha y hora formateada
            const entradasFormateadas = result.map(entrada => ({
                ...entrada,
                fecha: entrada.fecha_formateada,
                hora: entrada.hora_formateada
            }));
    
            console.log('Enviando respuesta con entradas...');
            res.json(entradasFormateadas);
        } catch (error) {
            console.error('Error al recuperar entradas:', error);
            res.status(500).json({ error: error.message });
        } finally {
            if (connection) {
                await connection.end();
                console.log('Conexión a la base de datos cerrada.');
            }
        }
    }

    static async misdatos(req, res) {
        console.log('Entrando en mis datos...');
        const usuarioId = req.session.userId;
    
        if (!usuarioId) {
            console.log('Usuario no autenticado');
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
    
        let connection;
        try {
            console.log('Intentando conectar a la base de datos...');
            connection = await mysql.createConnection(db);
    
            console.log('Ejecutando consulta...');
            const [result] = await connection.execute(
                'SELECT * FROM usuarios WHERE id = ?', [usuarioId]
            );
    
            console.log('Resultado de la consulta:', result);
    
            if (result.length === 0) {
                console.log('No se encontraron entradas para el usuario.');
                return res.status(404).json({ message: 'No se encontraron entradas' });
            }
    
            res.json(result);
        } catch (error) {
            console.error('Error en la API:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        } finally {
            if (connection) {
                await connection.end();
                console.log('Conexión a la base de datos cerrada.');
            }
        }
    }

    static async nuevaEntrada(req, res) {
        console.log('Entrando en nuevaEntrada...');
        
        const usuarioId = req.session.userId;
        console.log('Session ID en el middleware:', req.sessionID);
        console.log('Usuario ID en nuevaEntrada:', usuarioId);
    
        if (!usuarioId) {
            console.log('Usuario no autenticado');
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
    
        const { entrada } = req.body;
        console.log('Contenido de la entrada:', entrada);
    
        let connection;
        try {
            console.log('Intentando conectar a la base de datos...');
            connection = await mysql.createConnection(db);
            console.log('Conexión a la base de datos establecida.');
            
            console.log('Ejecutando consulta de inserción...');
            const [result] = await connection.execute(
                'INSERT INTO diarios (usuario_id, entrada, fecha_hora) VALUES (?, ?, NOW())',
                [usuarioId, entrada]
            );
            
            console.log('Resultado de la consulta de inserción:', result);
            res.json({ message: 'Entrada añadida exitosamente', id: result.insertId });
        } catch (error) {
            console.error('Error al añadir entrada:', error);
            res.status(500).json({ error: error.message });
        } finally {
            if (connection) {
                await connection.end();
                console.log('Conexión a la base de datos cerrada.');
            }
        }
    };

    static async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ error: 'No se pudo cerrar la sesión' });
                }
                res.clearCookie('connect.sid'); // Limpia la cookie de la sesión
                return res.status(200).json({ message: 'Sesión cerrada con éxito' });
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
};



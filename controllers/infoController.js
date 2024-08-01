import mysql from 'mysql2/promise';
import db from '../config/database.js';


export default class infoController {
    static async login(req, res) {
        let connection;
        try {
            const { nombre, contrasena } = req.body;
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute("SELECT * FROM usuarios WHERE nombre = ? AND contrasena = ?", [nombre, contrasena]);
    
            if (result.length > 0) {
                req.session.userId = result[0].id; 
                console.log('Session UserID after login:', req.session.userId); // Verifica si se guarda correctamente
                res.json(result[0]);
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
    }

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
    }

    static async details(req, res) {
        let connection;
        try {
            const idb = req.params.id;
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute("SELECT * FROM usuarios WHERE id = ?", [idb]);
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

    static async addScannerResult(req, res) {
        let connection;
        try {
            const { porcentaje_fumador,fecha_escaner, usuario_id } = req.body;
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute("INSERT INTO escanerFacial (porcentaje_fumador,fecha_escaner, usuario_id) VALUES (?,?, ?)", [porcentaje_fumador,fecha_escaner, usuario_id]);
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

    static async createPost(req, res) {
        let connection;
        try {
            const { contenido, fecha,usuario_id } = req.body;
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute("INSERT INTO publicaciones (contenido,fecha, usuario_id) VALUES (?, ?)", [contenido,fecha, usuario_id]);
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
    }

    static async getUserPosts(req, res) {
        let connection;
        try {
            const usuario_id = req.params.usuario_id;
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute("SELECT * FROM publicaciones WHERE usuario_id = ?", [usuario_id]);
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
    static async nuevaEntrada(req, res) {
        const usuarioId = req.session.userId;
    
        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
    
        const { entrada } = req.body;
        let connection;
        try {
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute(
                'INSERT INTO diarios (usuario_id, entrada, fecha_hora) VALUES (?, ?, NOW())',
                [usuarioId, entrada]
            );
            res.json({ message: 'Entrada añadida exitosamente', id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    };
    static async MisEntradas(req, res) {
        console.log('Entrando en MisEntradas...'); // Verifica si la función se está llamando
        
        // Verifica el contenido de req.session
        console.log('Contenido de req.session:', req.session);
        
        const usuarioId = req.session.userId;
        console.log('Usuario ID en MisEntradas:', usuarioId); // Verifica el usuarioId
    
        if (!usuarioId) {
            console.log('Usuario no autenticado');
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
    
        let connection;
        try {
            console.log('Intentando conectar a la base de datos...');
            connection = await mysql.createConnection(db);
            console.log('Conexión a la base de datos establecida.');
    
            // Verifica la configuración de la conexión a la base de datos
            console.log('Configuración de la base de datos:', db);
            
            console.log('Ejecutando consulta para obtener entradas...');
            const [result] = await connection.execute(
                'SELECT * FROM diarios WHERE usuario_id = ?', [usuarioId]
            );
    
            console.log('Resultado de la consulta:', result); // Verifica el resultado
            
            if (result.length === 0) {
                console.log('No se encontraron entradas para el usuario.');
                return res.status(404).json({ message: 'No se encontraron entradas' });
            }
    
            console.log('Enviando respuesta con entradas...');
            res.json(result);
        } catch (error) {
            console.error('Error al recuperar entradas:', error); // Más detalles del error
            res.status(500).json({ error: error.message });
        } finally {
            if (connection) {
                await connection.end();
                console.log('Conexión a la base de datos cerrada.');
            }
        }
    }
}

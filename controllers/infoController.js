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
            }

            // Insertar nuevo usuario
            const [result] = await connection.execute("INSERT INTO usuarios (nombre, email, contrasena, edad) VALUES (?, ?, ?, ?)", [nombre, email, contrasena, edad]);
            console.log(result);
            res.json({ message: "Usuario registrado exitosamente", insertId: result.insertId });
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

    static async addDiaryEntry(req, res) {
        let connection;
        try {
            const { entrada, fecha,usuario_id } = req.body;
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute("INSERT INTO diarios (entrada,fecha, usuario_id) VALUES (?,?, ?)", [entrada,fecha, usuario_id]);
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
}

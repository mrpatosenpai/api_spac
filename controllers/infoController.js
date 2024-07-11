import mysql from 'mysql2/promise';
import db from '../config/database.js';

export default class infoController {
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
            const [result] = await connection.execute("INSERT INTO usuarios (nombre, email, contrasena, edad) VALUES (?, ?, ?, ?)", [nombre, email, contrasena, edad]);
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
            const { entrada, usuario_id } = req.body;
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute("INSERT INTO diarios (entrada, usuario_id) VALUES (?, ?)", [entrada, usuario_id]);
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
            const { resultado, usuario_id } = req.body;
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute("INSERT INTO escanerFacial (resultado, usuario_id) VALUES (?, ?)", [resultado, usuario_id]);
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
            const { contenido, usuario_id } = req.body;
            connection = await mysql.createConnection(db);
            const [result] = await connection.execute("INSERT INTO publicaciones (contenido, usuario_id) VALUES (?, ?)", [contenido, usuario_id]);
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

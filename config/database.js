import Sequelize from 'sequelize';
// Configuración de la base de datos con Sequelize
const sequelize = new Sequelize('db_spac', 'admin', 'crisvalencia456', {
    host: 'dbspac.cb8i062mmrzs.us-east-2.rds.amazonaws.com',
    dialect: 'mysql',
    logging: false,
  });
/* const db={
    database: 'db_spac',
    host: 'dbspac.cb8i062mmrzs.us-east-2.rds.amazonaws.com',
    password: 'crisvalencia456',
    port: 3306,
    user: 'admin',
}
 */
export default sequelize;

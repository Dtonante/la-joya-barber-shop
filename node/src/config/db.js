import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_NAME:", process.env.DB_NAME);

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql"
});

try {
    await db.authenticate();
    console.log("✅ Conectado a la base de datos");
} catch (error) {
    console.error("❌ Error al conectar DB:", error);
}

export default db;
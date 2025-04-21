import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./src/config/db.js";
import { autoMarkAsCompleted } from "./src/jobs/autoMarkAsCompleted.js";

// Rutas
import usersRoutes from "./src/routes/usersRoutes.js";
import rolesRoutes from "./src/routes/rolesRoutes.js";
import quotesRoutes from "./src/routes/quotesRoutes.js";
import scheduleConfigRouters from "./src/routes/scheduleConfigRoutes.js"



// Modelos y asociaciones
import "./src/models/index.js"; //Esto importa modelos y relaciones

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));


// Endpoints
app.use("/api/v1/roles", rolesRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/quotes", quotesRoutes);
app.use("/api/v1/scheduleConfig", scheduleConfigRouters);

// Middleware de ruta no encontrada
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

// Sincronizar modelos con base de datos
await sequelize.sync({ alter: true });
console.log("📌 Base de datos sincronizada y modelos actualizados automáticamente");

// se inicializa el job
autoMarkAsCompleted()

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));

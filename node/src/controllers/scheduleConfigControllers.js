// controllers/scheduleConfigController.js
import ScheduleConfig from "../models/scheduleConfigModel.js";

export const getScheduleConfigByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required (YYYY-MM-DD)" });
    }

    // Check if there's a custom config for that date
    let config = await ScheduleConfig.findOne({ where: { date } });

    // If no config exists, use default config (date = null)
    if (!config) {
      config = await ScheduleConfig.findOne({ where: { date: null } });
    }

    if (!config) {
      return res.status(404).json({ message: "No default or custom schedule config found" });
    }

    res.status(200).json(config);
  } catch (error) {
    console.error("Error fetching schedule config:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// create schedule Config
export const createScheduleConfig = async (req, res) => {
  try {
    const { date, workStart, workEnd, lunchStart, lunchEnd } = req.body;

    // Validar campos obligatorios
    if (!workStart || !workEnd || !lunchStart || !lunchEnd) {
      return res.status(400).json({ message: "Todos los campos de horario son obligatorios" });
    }

    // Verificar si ya existe una configuración para esa fecha (incluso si es null)
    const existingConfig = await ScheduleConfig.findOne({ where: { date } });

    if (existingConfig) {
      return res.status(400).json({ message: "Ya existe una configuración para esa fecha" });
    }

    // Crear nueva configuración
    const newConfig = await ScheduleConfig.create({
      date: date || null, // Acepta null explícitamente
      workStart,
      workEnd,
      lunchStart,
      lunchEnd,
    });

    res.status(201).json(newConfig);
  } catch (error) {
    console.error("Error al crear configuración:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

  

import QuoteModel from "../models/quoteModel.js";
import UserModel from "../models/userModel.js";
import paginate from "../middlewares/paginate.js";
import generateFilters from "../middlewares/filter.js";
import { Op } from "sequelize";

// Obtener todas las citas con paginación y filtros
export const getQuotes = (req, res) => {
    const allowedFilters = ["id_userFK", "dateAndTimeQuote"];
    const filters = generateFilters(req.query, allowedFilters);

    const userWhere = req.query.name
        ? { name: { [Op.like]: `%${req.query.name}%` } }
        : undefined;

    paginate(QuoteModel, req, res, filters, {
        include: [{
            model: UserModel,
            attributes: ["name", "email"],
            where: userWhere
        }]
    });
};

// obtener todas las citas sin paginado y filtros para el calendario
export const getAllQuotes = async (req, res) => {
    try {
        const quotes = await QuoteModel.findAll({
            include: [{
                model: UserModel,
                attributes: ["name", "email"]
            }],
            order: [['dateAndTimeQuote', 'ASC']]
        });

        res.status(200).json({ data: quotes });
    } catch (error) {
        console.error("Error al obtener todas las citas:", error);
        res.status(500).json({ message: "Error al obtener las citas" });
    }
};


// Obtener citas futuras con paginación y filtros
export const getUpcomingQuotes = (req, res) => {
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - 20);

    const allowedFilters = ["id_userFK"];
    const filters = generateFilters(req.query, allowedFilters);

    filters.dateAndTimeQuote = {
        [Op.gte]: ahora
    };

    const userWhere = req.query.name
        ? { name: { [Op.like]: `%${req.query.name}%` } }
        : undefined;

    paginate(QuoteModel, req, res, filters, {
        include: [
            {
                model: UserModel,
                attributes: ["name", "email"],
                where: userWhere
            }
        ],
        order: [["dateAndTimeQuote", "ASC"]]
    });
};







// Obtener una cita por ID
export const getQuotesForID = async (req, res) => {
    try {
        const { id_quotePK } = req.params;
        const quote = await QuoteModel.findByPk(id_quotePK);
        if (!quote) return res.status(404).json({ message: "Cita no encontrado" });

        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la cita", error: error.message });
    }
};

// Obtener todas las citas por id_userFK
export const getQuotesByUser = async (req, res) => {
    try {
        const { id_userFK } = req.params;

        const citas = await QuoteModel.findAll({
            where: { id_userFK },
        });

        if (!citas || citas.length === 0) {
            return res.status(404).json({ message: "No se encontraron citas para este usuario" });
        }

        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las citas del usuario",
            error: error.message,
        });
    }
};


//// Crear una cita 
export const createQuote = async (req, res) => {
    try {
        const { id_userFK, dateAndTimeQuote } = req.body;

        if (!id_userFK || !dateAndTimeQuote) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Convertir la fecha y hora a objeto Date
        const fechaHora = new Date(dateAndTimeQuote);
        const hora = fechaHora.getHours();
        const minutos = fechaHora.getMinutes();

        // Validar horario laboral: entre 08:00 y 17:00
        const horaEnMinutos = hora * 60 + minutos;
        const inicioLaboral = 9 * 60;   // 08:00
        const finLaboral = 20 * 60;     // 17:00

        if (horaEnMinutos < inicioLaboral || horaEnMinutos >= finLaboral) {
            return res.status(400).json({
                message: "La cita debe estar dentro del horario laboral (08:00 - 17:00)"
            });
        }

         // Validar que no esté en el horario de almuerzo (12:00 - 14:00)
         const inicioAlmuerzo = 12 * 60;
         const finAlmuerzo = 14 * 60;

        // Verificar si ya existe una cita para esa fecha y hora
        const citaExistente = await QuoteModel.findOne({
            where: { dateAndTimeQuote }
        });

        if (citaExistente) {
            return res.status(409).json({
                message: "Ya hay una cita agendada para esta fecha y hora"
            });
        }

        // Crear la nueva cita si no hay conflicto
        const nuevaCita = await QuoteModel.create({
            id_userFK,
            dateAndTimeQuote
        });

        res.status(201).json({ message: "Cita creada con éxito", cita: nuevaCita });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la cita", error: error.message });
    }
};




// Actualizar una cita por su ID
export const updateQuote = async (req, res) => {
    try {
        const { id_quotePK } = req.params;
        const quote = await QuoteModel.findByPk(id_quotePK);
        if (!quote) return res.status(404).json({ message: "Cita no encontrado" });

        await quote.update(req.body);
        res.status(200).json({ message: "Cita actualizado con éxito", quote });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la cita", error: error.message });
    }
};

// Eliminar una cita por su ID
export const deleteQuote = async (req, res) => {
    try {
        const { id_quotePK } = req.params;
        const quote = await QuoteModel.findByPk(id_quotePK);
        if (!quote) return res.status(404).json({ message: "Cita no encontrado" });

        await quote.destroy();
        res.status(200).json({ message: "Cita eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la cita", error: error.message });
    }
};

// Traer las horas disponibles del dia seleccionado o enviado
export const getAvailableHoursByDate = async (req, res) => {
    try {
        const { fecha } = req.query;

        if (!fecha) {
            return res.status(400).json({ message: "La fecha es requerida en el formato YYYY-MM-DD" });
        }

        // Rango del día completo
        const startOfDay = new Date(`${fecha}T00:00:00`);
        const endOfDay = new Date(`${fecha}T23:59:59`);

        // Obtener todas las citas agendadas para ese día
        const citasDelDia = await QuoteModel.findAll({
            where: {
                dateAndTimeQuote: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        // Extraer solo las horas ocupadas
        const horasOcupadas = citasDelDia.map(cita => {
            const hora = new Date(cita.dateAndTimeQuote).toTimeString().substring(0, 5); // formato HH:MM
            return hora;
        });

        // Generar todas las horas posibles del día (de 08:00 a 17:00, cada 30 min)
        const generarHoras = (inicio = "09:00", fin = "20:30", intervalo = 30) => {
            const horas = [];
            let [h, m] = inicio.split(":").map(Number);
            const [hFin, mFin] = fin.split(":").map(Number);
        
            while (h < hFin || (h === hFin && m < mFin)) {
                // Omitir el horario de almuerzo de 12:00 a 14:00
                if (h < 12 || h >= 14) {
                    const hora = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
                    horas.push(hora);
                }
        
                m += intervalo;
                if (m >= 60) {
                    h++;
                    m -= 60;
                }
            }
        
            return horas;
        };
        

        const todasLasHoras = generarHoras();

        // Filtrar las horas disponibles
        const horasDisponibles = todasLasHoras.filter(hora => !horasOcupadas.includes(hora));

        res.status(200).json({ fecha, horasDisponibles });
    } catch (error) {
        console.error("Error al obtener horas disponibles:", error);
        res.status(500).json({ message: "Error al obtener horas disponibles" });
    }
};

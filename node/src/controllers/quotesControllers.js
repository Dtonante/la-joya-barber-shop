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

    const allowedFilters = ["id_userFK"]; // quitamos dateAndTimeQuote para evitar conflicto
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

// Crear una nueva cita
// export const createQuote = async (req, res) => {
//     try {
//         const { id_userFK, dateAndTimeQuote } = req.body;

//         if (!id_userFK || !dateAndTimeQuote) {
//             return res.status(400).json({ message: "Todos los campos son obligatorios" });
//         }

//         const nuevaCita = await QuoteModel.create({
//             id_userFK,
//             dateAndTimeQuote
//         });

//         res.status(201).json({ message: "Cita creada con éxito", cita: nuevaCita });
//     } catch (error) {
//         res.status(500).json({ message: "Error al crear la cita", error: error.message });
//     }
// };


export const createQuote = async (req, res) => {
    try {
        const { id_userFK, dateAndTimeQuote } = req.body;

        if (!id_userFK || !dateAndTimeQuote) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

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
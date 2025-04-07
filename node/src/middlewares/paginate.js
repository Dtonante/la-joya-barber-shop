const paginate = async (model, req, res, where = {}) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const results = await model.findAndCountAll({
            where, // Para aplicar filtros dinámicos
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.json({
            total: results.count,
            pagina: parseInt(page),
            totalPaginas: Math.ceil(results.count / limit),
            data: results.rows,
        });
    } catch (error) {
        res.status(500).json({ error: "Error en la paginación", detalle: error.message });
    }
};

export default paginate;

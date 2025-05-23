import { DataTypes } from "sequelize";
import db from "../config/db.js";

const quoteModel = db.define("tbl_quotes", {
    id_quotePK: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_userFK: { type: DataTypes.INTEGER, allowNull: false },
    dateAndTimeQuote: { type: DataTypes.DATE, allowNull: false },
    status: { 
        type: DataTypes.ENUM("activa", "realizada", "cancelada"),
        allowNull: false,
        defaultValue: "activa"
    }
}, { 
    timestamps: false,
    tableName: "tbl_quotes" 
});

export default quoteModel;
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const roleModel = db.define("tbl_roles", {
    id_rolePK: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name_role: { type: DataTypes.STRING, allowNull: false }
}, { 
    timestamps: false,
    tableName: "tbl_roles" 
});


export default roleModel;
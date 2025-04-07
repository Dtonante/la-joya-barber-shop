import { DataTypes } from "sequelize";
import db from "../config/db.js";

const userModel = db.define("tbl_users", {
    id_userPK: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    cellPhoneNumber: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    id_roleFK: { type: DataTypes.INTEGER, allowNull: false }
}, { 
    timestamps: false,
    tableName: "tbl_users" 
});


export default userModel;
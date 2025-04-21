// models/scheduleConfigModel.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const scheduleConfigModel = db.define("tbl_schedule_config", {
  id_schedule_configPK: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true, // null for default config
  },
  workStart: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  workEnd: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lunchStart: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lunchEnd: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: "tbl_schedule_config"
});

export default scheduleConfigModel;

import userModel from "./userModel.js";
import roleModel from "./roleModel.js";
import quoteModel from "./quoteModel.js";

// Aquí se definen las relaciones

// Un rol puede tener muchos usuarios
roleModel.hasMany(userModel, { foreignKey: "id_roleFK", as: "users" });

// Un usuario pertenece a un rol
userModel.belongsTo(roleModel, { foreignKey: "id_roleFK", as: "role" });

// Un usuario puede tener muchas citas
roleModel.hasMany(Quote, { foreignKey: 'id_userFK' });

// Una cita pertenece a un usuario
quoteModel.belongsTo(roleModel, { foreignKey: 'id_userFK' });


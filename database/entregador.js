const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Pedido = require("./pedido");

const Entregador = connection.define(
  "Entregador",
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100],
      },
    },
    telefone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        matches: /^[\d-]+$/,
      },
    },
  },
  { paranoid: true, deletedAt: "destroyTime" }
);
Entregador.hasMany(Pedido);
Pedido.belongsTo(Entregador);

module.exports = Entregador;
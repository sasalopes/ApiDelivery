const { DataTypes } = require("sequelize");
const { connection } = require("./database");


const Pedido = connection.define(
  "Pedido",
  {
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100], // Verifica se a string tem de 0 a 100 caracteres
      },
    },
    endereco_entrega: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Verifica se o valor não é vazio
      },
    },
    urgencia: {
      type: DataTypes.ENUM("alta", "media", "baixa"),
      allowNull: false,
      validate: {
        isIn: [["alta", "media", "baixa"]], // Verifica se o valor está entre as opções permitidas
      },
    },
  },
  { paranoid: true, deletedAt: "destroyTime" }
);

module.exports = Pedido;
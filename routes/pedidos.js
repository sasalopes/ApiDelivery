const { Router } = require("express");
const Pedido = require("../database/pedido");
const { Op } = require("sequelize");
const Entregador = require("../database/entregador");

const router = Router();

//Adicionar um novo pedido ok
router.post("/pedidos", async (req, res) => {
  const { descricao, endereco_entrega, urgencia } = req.body;
  try {
    const pedido = await Pedido.create({
      descricao,
      endereco_entrega,
      urgencia,
    });
    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Lista de pedidos
router.get("/pedidos", async (req, res) => {
  try {
    const listaPedidos = await Pedido.findAll({ include: [Entregador] });
    res.json(listaPedidos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Procura de pedidos
router.get("/pedidos/:id", async (req, res) => {
  const pedido = await Pedido.findOne({
    where: { id: req.params.id },
    include: [Entregador],
  });

  try {
    if (pedido) {
      res.json(pedido);
    } else res.status(404).json({ message: err.message });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Rota para filtrar pedidos por descrição
router.get("/pedidos/descricao/:descricao", async (req, res) => {
  const pedidos = await Pedido.findAll({
    where: { descricao: { [Op.like]: `%${req.params.descricao}%` } },
  });
  if (pedidos) {
    res.json(pedidos);
  } else res.status(404).json({ message: "Descrição não encontrada" });
});

// Rota para filtrar pedidos por endereço de entrega
router.get("/pedidos/endereco_entrega/:endereco", async (req, res) => {
  const pedidos = await Pedido.findAll({
    //Com o Op é possível pesquisar por apenas caracteres contidos
    where: { endereco_entrega: { [Op.like]: `%${req.params.endereco}%` } },
  });
  if (pedidos) {
    res.json(pedidos);
  } else res.status(404).json({ message: "Não há pedidos com esse endereço" });
});

// Rota para filtrar pedidos por urgência
router.get("/pedidos/urgencia/:urgencia", async (req, res) => {
  const pedidos = await Pedido.findAll({
    where: { urgencia: req.params.urgencia },
  });
  if (pedidos) {
    res.json(pedidos);
  } else res.status(404).json({ message: "Não há pedidos com essa urgencia" });
});

//Atualizar pedido
router.put("/pedidos/:id", async (req, res) => {
  const { descricao, endereco_entrega, urgencia } = req.body;
  const pedido = await Pedido.findByPk(req.params.id);

  try {
    if (pedido) {
      await Pedido.update(
        { descricao, endereco_entrega, urgencia },
        { where: { id: req.params.id } }
      );
      res.json({ message: "Pedido atualizado com sucesso." });
    } else res.status(404).json({ message: "Pedido não encontrado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Excluir pedido
router.delete("/pedidos/:id", async (req, res) => {
  const pedido = await Pedido.findByPk(req.params.id);

  if (pedido) {
    await pedido.destroy();
    res.json({ message: "O Pedido foi deletado" });
  } else res.status(404).json({ message: "Pedido não encontrado" });
});

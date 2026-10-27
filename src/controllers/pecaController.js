const pecaService = require('../services/pecaService');

// devolve o erro para o cliente com o status certo
function tratarErro(res, erro) {
  if (erro.status) {
    return res.status(erro.status).json({ erro: erro.message });
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor' });
}

async function listar(req, res) {
  try {
    const pecas = await pecaService.listar();
    res.status(200).json(pecas);
  } catch (erro) {
    tratarErro(res, erro);
  }
}

async function buscarPorId(req, res) {
  try {
    const id = Number(req.params.id);
    const peca = await pecaService.buscarPorId(id);
    res.status(200).json(peca);
  } catch (erro) {
    tratarErro(res, erro);
  }
}

async function buscarPorNome(req, res) {
  try {
    const nome = req.query.nome;
    const pecas = await pecaService.buscarPorNome(nome);
    res.status(200).json(pecas);
  } catch (erro) {
    tratarErro(res, erro);
  }
}

async function criar(req, res) {
  try {
    const { nome_peca, descr_peca } = req.body;
    const peca = await pecaService.criar(nome_peca, descr_peca);
    res.status(201).json(peca);
  } catch (erro) {
    tratarErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const { nome_peca, descr_peca } = req.body;
    const peca = await pecaService.atualizar(id, nome_peca, descr_peca);
    res.status(200).json(peca);
  } catch (erro) {
    tratarErro(res, erro);
  }
}

async function excluir(req, res) {
  try {
    const id = Number(req.params.id);
    const tipo = req.query.tipo || 'logica'; // se não informar, a exclusão é lógica
    const mensagem = await pecaService.excluir(id, tipo);
    res.status(200).json({ mensagem });
  } catch (erro) {
    tratarErro(res, erro);
  }
}

module.exports = { listar, buscarPorId, buscarPorNome, criar, atualizar, excluir };

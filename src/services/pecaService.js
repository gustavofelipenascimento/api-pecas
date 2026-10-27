const pecaRepository = require('../repositories/pecaRepository');

// cria um erro com o status HTTP que deve ser devolvido
function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function validarId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw criarErro('ID inválido', 400);
  }
}

function validarDados(nome_peca, descr_peca) {
  if (typeof nome_peca !== 'string' || nome_peca.trim() === '') {
    throw criarErro('O campo nome_peca é obrigatório', 400);
  }
  if (typeof descr_peca !== 'string' || descr_peca.trim() === '') {
    throw criarErro('O campo descr_peca é obrigatório', 400);
  }
}

// lista só as peças que não foram excluídas
async function listar() {
  const pecas = await pecaRepository.lerPecas();
  return pecas.filter((peca) => peca.ativo);
}

async function buscarPorId(id) {
  validarId(id);
  const pecas = await listar();
  const peca = pecas.find((p) => p.id_peca === id);
  if (!peca) {
    throw criarErro('Peça não encontrada', 404);
  }
  return peca;
}

async function buscarPorNome(nome) {
  if (typeof nome !== 'string' || nome.trim() === '') {
    throw criarErro('Informe o nome da peça para buscar', 400);
  }
  const pecas = await listar();
  return pecas.filter((p) => p.nome_peca.toLowerCase().includes(nome.trim().toLowerCase()));
}

async function criar(nome_peca, descr_peca) {
  validarDados(nome_peca, descr_peca);
  const pecas = await pecaRepository.lerPecas();

  // o novo id é o maior id existente + 1
  let novoId = 1;
  if (pecas.length > 0) {
    novoId = Math.max(...pecas.map((p) => p.id_peca)) + 1;
  }

  const novaPeca = {
    id_peca: novoId,
    nome_peca: nome_peca.trim(),
    descr_peca: descr_peca.trim(),
    ativo: true,
  };

  pecas.push(novaPeca);
  await pecaRepository.salvarPecas(pecas);
  return novaPeca;
}

async function atualizar(id, nome_peca, descr_peca) {
  validarId(id);
  validarDados(nome_peca, descr_peca);
  const pecas = await pecaRepository.lerPecas();

  const peca = pecas.find((p) => p.id_peca === id && p.ativo);
  if (!peca) {
    throw criarErro('Peça não encontrada', 404);
  }

  peca.nome_peca = nome_peca.trim();
  peca.descr_peca = descr_peca.trim();
  await pecaRepository.salvarPecas(pecas);
  return peca;
}

// Regra de negócio: o usuário escolhe o tipo de exclusão
// - logica: a peça continua salva, mas fica com ativo = false
// - definitiva: a peça é apagada do arquivo
async function excluir(id, tipo) {
  validarId(id);
  if (tipo !== 'logica' && tipo !== 'definitiva') {
    throw criarErro('Tipo de exclusão inválido. Use logica ou definitiva', 400);
  }

  const pecas = await pecaRepository.lerPecas();
  const indice = pecas.findIndex((p) => p.id_peca === id);
  if (indice === -1) {
    throw criarErro('Peça não encontrada', 404);
  }

  if (tipo === 'logica') {
    if (!pecas[indice].ativo) {
      throw criarErro('Peça já foi excluída', 400);
    }
    pecas[indice].ativo = false;
    await pecaRepository.salvarPecas(pecas);
    return 'Peça excluída logicamente';
  }

  pecas.splice(indice, 1);
  await pecaRepository.salvarPecas(pecas);
  return 'Peça excluída definitivamente';
}

module.exports = { listar, buscarPorId, buscarPorNome, criar, atualizar, excluir };

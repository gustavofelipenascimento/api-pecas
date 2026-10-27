const fs = require('fs/promises');
const path = require('path');

// arquivo onde as peças ficam salvas
const caminhoArquivo = path.join(__dirname, '..', '..', 'data', 'pecas.json');

// lê o arquivo de forma assíncrona e devolve a lista de peças
async function lerPecas() {
  try {
    const conteudo = await fs.readFile(caminhoArquivo, 'utf-8');
    return JSON.parse(conteudo);
  } catch (erro) {
    // se o arquivo ainda não existe, começa com a lista vazia
    if (erro.code === 'ENOENT') {
      return [];
    }
    throw erro;
  }
}

// grava a lista de peças no arquivo de forma assíncrona
async function salvarPecas(pecas) {
  await fs.mkdir(path.dirname(caminhoArquivo), { recursive: true });
  await fs.writeFile(caminhoArquivo, JSON.stringify(pecas, null, 2));
}

module.exports = { lerPecas, salvarPecas };

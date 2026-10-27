const express = require('express');
const pecaRoutes = require('./routes/pecaRoutes');

const app = express();
const PORTA = process.env.PORT || 3000;

// permite receber JSON no corpo das requisições
app.use(express.json());

// rotas de peças
app.use('/pecas', pecaRoutes);

// rota que não existe
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// trata erro de JSON mal formado no corpo da requisição
app.use((erro, req, res, next) => {
  if (erro instanceof SyntaxError) {
    return res.status(400).json({ erro: 'JSON inválido' });
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

const express = require('express');
const pecaController = require('../controllers/pecaController');

const router = express.Router();

router.get('/', pecaController.listar);
router.get('/buscar', pecaController.buscarPorNome); // tem que ficar antes do /:id
router.get('/:id', pecaController.buscarPorId);
router.post('/', pecaController.criar);
router.put('/:id', pecaController.atualizar);
router.delete('/:id', pecaController.excluir);

module.exports = router;

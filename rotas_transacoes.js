const express = require('express');
const router = express.Router();
const pool = require('./db');

// SALVAR
router.post('/transacoes', async (req, res) => {
    const {
        nome,
        descricao,
        valor,
        data,
        categoria,
        tipo
    } = req.body;

    try {
        const resultado = await pool.query(
            `INSERT INTO transacoes_financeiras.transacoes (nome, descricao, valor, data, categoria, tipo)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nome, descricao, valor, data, categoria, tipo]
        );

        res.status(201).json({
            mensagem: 'Transação salva com sucesso!',
            transacao: resultado.rows[0]
        });
    } catch (erro) {
        res.status(500).json({erro: 'Erro ao salvar transação.'});
    }
});

// BUSCAR
router.get('/transacoes/:nome', async (req, res) => {
    const {nome} = req.params;

    try {
        const resultado = await pool.query(
            'SELECT * FROM transacoes_financeiras.transacoes WHERE nome = $1',
            [nome]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({mensagem: 'Transação não encontrada.'});
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({erro: 'Erro ao buscar transação.'});
    }
});

// ATUALIZAR
router.put('/transacoes/:nome', async (req, res) => {
    const {nome} = req.params;
    const {
        descricao,
        valor,
        data,
        categoria,
        tipo
    } = req.body;

    try {
        const resultado = await pool.query(
            `UPDATE transacoes_financeiras.transacoes
             SET descricao     = $1,
                 valor         = $2,
                 data          = $3,
                 categoria     = $4,
                 tipo          = $5,
                 atualizado_em = CURRENT_TIMESTAMP
             WHERE nome = $6 RETURNING *`,
            [descricao, valor, data, categoria, tipo, nome]
        );

        res.json({
            mensagem: 'Transação alterada com sucesso!',
            transacao: resultado.rows[0]
        });
    } catch (erro) {
        res.status(500).json({erro: 'Erro ao alterar transação.'});
    }
});

// EXCLUIR
router.delete('/transacoes/:nome', async (req, res) => {
    const {nome} = req.params;

    try {
        await pool.query(
            'DELETE FROM transacoes_financeiras.transacoes WHERE nome = $1',
            [nome]
        );

        res.status(200).json({mensagem: 'Transação excluída com sucesso!'});
    } catch (erro) {
        res.status(500).json({erro: 'Erro ao excluir transação.'});
    }
});

module.exports = router;

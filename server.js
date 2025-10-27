const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());

const rotas_transacoes = require('./rotas_transacoes');
app.use('/api', rotas_transacoes);

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});

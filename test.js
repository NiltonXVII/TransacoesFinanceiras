const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao testar conexão:', err.message);
    } else {
        console.log('Conexão OK. Hora atual do banco:', res.rows[0].now);
    }
    pool.end();
});

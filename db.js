const {Pool} = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5432
});

pool.on('connect', () => {
    console.log('Conexão com o banco estabelecida com sucesso!');
});

pool.on('error', (err) => {
    console.error('Erro na conexão com o banco!', err.message);
});

module.exports = pool;





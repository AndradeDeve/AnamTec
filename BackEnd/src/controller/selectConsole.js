import { createPool } from 'mysql2/promise';
    
const dbConfig = {
    host:'bkwsvvw7cnhles82o60k-mysql.services.clever-cloud.com',
    port:3306,
    user:'ubtjdawc0orrpk4s',
    password:'pfeRiZZOIvfg92OAVcCP',    
    database:'bkwsvvw7cnhles82o60k'
};

// Cria o pool de conexões
const poolSQL = createPool(dbConfig);


async function getTableData() {
    let connection;
    const tableName = 'tbl_curso';

    try {
        console.log(`\nConectando e buscando dados da tabela: ${tableName}`);
        // Pega uma conexão do pool
        connection = await poolSQL.getConnection();

        const sqlQuery = `SELECT * FROM ${tableName}`;
        // Executa a query
        const [rows] = await connection.execute(sqlQuery); 

        console.log(`\n==================================`);
        console.log(`\n✅ REGISTROS ENCONTRADOS NA TABELA ${tableName}:`);
        
        // ====================================
        // ESTA É A CORREÇÃO PRINCIPAL: Exibir os dados!
        // O array 'rows' contém os registros retornados.
        console.log(rows); 
        // ====================================

        console.log(`\nTotal de registros: ${rows.length}`);
        console.log(`\n==================================`);


    } catch (error) { // Boa prática: capturar o erro para debug
        console.log(`\n==================================`);
        console.log(`\n❌ ERRO AO LER A TABELA ${tableName}`);
        console.error(error); // Mostra o erro real
        console.log(`\n==================================`);

    } finally {
        // Sempre libera a conexão de volta para o pool
        if (connection) {
            connection.release();
        }
        // Encerra o pool de conexões (opcional, mas bom para scripts de execução única)
        await poolSQL.end();
        console.log('\nConexão encerrada com sucesso');
    }
}

getTableData();
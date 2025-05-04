module.exports = class Db1746369156563 {
    name = 'Db1746369156563'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`tbl_tipo_sang\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipo_sanguineo\` varchar(3) NOT NULL, \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbl_responsavel\` (\`cpf\` int NOT NULL, \`nome\` varchar(45) NOT NULL, \`estado_civil\` varchar(10) NOT NULL, \`email\` varchar(45) NOT NULL, \`numero_tel\` varchar(15) NOT NULL, \`createAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletAt\` datetime NULL, PRIMARY KEY (\`cpf\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbl_professor\` (\`rm\` varchar(10) NOT NULL, \`nome\` varchar(45) NOT NULL, \`email\` varchar(50) NOT NULL, \`senha\` varchar(20) NOT NULL, \`tipo\` enum ('adimin', 'common') NOT NULL, \`createdAt\` datetime NOT NULL, \`deletedAt\` datetime NULL, UNIQUE INDEX \`IDX_f04f560f00919998f7a2d8dccb\` (\`rm\`), PRIMARY KEY (\`rm\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbl_endereco\` (\`cep\` int(8) NOT NULL, \`logradouro\` varchar(80) NOT NULL, \`numero\` int(5) NOT NULL, \`uf\` char(2) NOT NULL, \`bairro\` varchar(25) NOT NULL, \`cidade\` varchar(35) NOT NULL, \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime NULL, PRIMARY KEY (\`cep\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbl_cadastro\` (\`id\` varchar(15) NOT NULL, \`ra\` varchar(15) NOT NULL, \`nome\` varchar(45) NOT NULL, \`data_nasc\` date NOT NULL, \`genero\` varchar(45) NULL, \`email\` varchar(45) NOT NULL, \`numero_tel\` varchar(15) NULL, \`createAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletAt\` datetime NULL, UNIQUE INDEX \`IDX_24217254557d09023ef71a66a2\` (\`id\`), UNIQUE INDEX \`IDX_2d7a68c4c41bafadcc6f787d7f\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_2d7a68c4c41bafadcc6f787d7f\` ON \`tbl_cadastro\``);
        await queryRunner.query(`DROP INDEX \`IDX_24217254557d09023ef71a66a2\` ON \`tbl_cadastro\``);
        await queryRunner.query(`DROP TABLE \`tbl_cadastro\``);
        await queryRunner.query(`DROP TABLE \`tbl_endereco\``);
        await queryRunner.query(`DROP INDEX \`IDX_f04f560f00919998f7a2d8dccb\` ON \`tbl_professor\``);
        await queryRunner.query(`DROP TABLE \`tbl_professor\``);
        await queryRunner.query(`DROP TABLE \`tbl_responsavel\``);
        await queryRunner.query(`DROP TABLE \`tbl_tipo_sang\``);
    }
}

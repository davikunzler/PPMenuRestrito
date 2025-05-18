CREATE DATABASE menuRestritoDB;
USE menuRestritoDB;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE estabelecimentos(
	nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    local ,
    filtro ,
    descricao VARCHAR(255) NOT NULL
	);
drop table clientes;
SELECT * FROM clientes;

describe table clientes;
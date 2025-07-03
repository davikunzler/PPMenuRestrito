CREATE DATABASE menuRestritoDB;
USE menuRestritoDB;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE estabelecimentos(
	idEstabelecimento INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cidade ENUM('sao leopoldo', 'novo hamburgo', 'sapucaia') NOT NULL,
    filtro ENUM('glutenCC','glutenSC', 'lactose') NOT NULL,
    descricao VARCHAR(255) NOT NULL
	);
    
CREATE TABLE localizacao(
	FOREIGN KEY (localId) REFERENCES estabelecimento(idEstabelecimento),
    cidade );
    
DROP database menuRestritoDB;
  
SELECT * FROM clientes;

describe table clientes;
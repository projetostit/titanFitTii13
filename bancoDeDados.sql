
CREATE TABLE professor (
    id_professor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    curriculo TEXT,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    registro_cref VARCHAR(50) NOT NULL UNIQUE,
    bacharelado VARCHAR(150),
    formacao_academica VARCHAR(255),
    status VARCHAR(30) NOT NULL,
    especialidade VARCHAR(100)
);

CREATE TABLE aluno (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cpf VARCHAR(14) NOT NULL UNIQUE
);

CREATE TABLE ficha_aluno (
    id_ficha INT AUTO_INCREMENT PRIMARY KEY,
    idade INT NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    altura DECIMAL(4,2) NOT NULL,
    objetivo VARCHAR(50) NOT NULL,
    id_aluno INT NOT NULL UNIQUE,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ficha_aluno
        FOREIGN KEY (id_aluno)
        REFERENCES aluno(id_aluno)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE evolucao (
    id_evolucao INT AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    carga DECIMAL(7,2) NOT NULL,

    CONSTRAINT fk_evolucao_aluno
        FOREIGN KEY (id_aluno)
        REFERENCES aluno(id_aluno)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE exercicio (
    id_exercicio INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    grupo_muscular VARCHAR(100) NOT NULL,
    video VARCHAR(500)
);

CREATE TABLE plano (
    id_plano INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL,
    tipo_plano VARCHAR(50) NOT NULL
);

CREATE TABLE professor_aluno (
    id_professor_aluno INT AUTO_INCREMENT PRIMARY KEY,
    id_professor INT NOT NULL,
    id_aluno INT NOT NULL,
    data_vinculo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL,

    CONSTRAINT fk_professor_aluno_professor
        FOREIGN KEY (id_professor)
        REFERENCES professor(id_professor)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_professor_aluno_aluno
        FOREIGN KEY (id_aluno)
        REFERENCES aluno(id_aluno)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uk_professor_aluno
        UNIQUE (id_professor, id_aluno)
);

CREATE TABLE treino (
    id_treino INT AUTO_INCREMENT PRIMARY KEY,
    nome_treino VARCHAR(100) NOT NULL,
    tipo_treino VARCHAR(100) NOT NULL,
    objetivo VARCHAR(50) NOT NULL,
    id_ficha INT NOT NULL,
    id_professor INT NOT NULL,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_treino_ficha
        FOREIGN KEY (id_ficha)
        REFERENCES ficha_aluno(id_ficha)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_treino_professor
        FOREIGN KEY (id_professor)
        REFERENCES professor(id_professor)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE aluno_plano (
    id_aluno_plano INT AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    id_plano INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status VARCHAR(30) NOT NULL,

    CONSTRAINT fk_aluno_plano_aluno
        FOREIGN KEY (id_aluno)
        REFERENCES aluno(id_aluno)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_aluno_plano_plano
        FOREIGN KEY (id_plano)
        REFERENCES plano(id_plano)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE treino_exercicio (
    id_treino_exercicio INT AUTO_INCREMENT PRIMARY KEY,
    carga DECIMAL(7,2) NOT NULL,
    ordem INT NOT NULL,
    serie INT NOT NULL,
    repeticoes INT NOT NULL,
    descanso INT NOT NULL,
    observacao TEXT,
    id_exercicio INT NOT NULL,
    id_treino INT NOT NULL,

    CONSTRAINT fk_treino_exercicio_exercicio
        FOREIGN KEY (id_exercicio)
        REFERENCES exercicio(id_exercicio)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_treino_exercicio_treino
        FOREIGN KEY (id_treino)
        REFERENCES treino(id_treino)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE pagamento (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    valor DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    comprovante VARCHAR(500),
    id_aluno_plano INT NOT NULL,

    CONSTRAINT fk_pagamento_aluno_plano
        FOREIGN KEY (id_aluno_plano)
        REFERENCES aluno_plano(id_aluno_plano)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE recuperacao_senha (
    id_recuperacao INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expiracao DATETIME NOT NULL,
    usado BOOLEAN NOT NULL DEFAULT FALSE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE solicitacao_conexao (
    id_solicitacao INT AUTO_INCREMENT PRIMARY KEY,

    id_aluno INT NOT NULL,

    id_professor INT NOT NULL,

    status ENUM(
        'Pendente',
        'Aceita',
        'Recusada'
    ) DEFAULT 'Pendente',

    data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,

    data_resposta DATETIME NULL,

    FOREIGN KEY (id_aluno)
        REFERENCES aluno(id_aluno),

    FOREIGN KEY (id_professor)
        REFERENCES professor(id_professor)
);

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FichaAlunoService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async cadastrar(
    dados: any,
    usuarioId: number,
    tipoUsuario: string,
  ) {
    const pool = this.databaseService.getPool();

    if (tipoUsuario === 'aluno' && dados.id_aluno !== usuarioId) {
      return {
        mensagem: 'Você só pode criar sua própria ficha',
      };
    }

    if (tipoUsuario === 'professor') {
      const [vinculo]: any = await pool.query(
        `SELECT id_professor_aluno
         FROM professor_aluno
         WHERE id_professor = ?
         AND id_aluno = ?
         AND status = 'Ativo'`,
        [usuarioId, dados.id_aluno],
      );

      if (vinculo.length === 0) {
        return {
          mensagem: 'Você não está vinculado a esse aluno',
        };
      }
    }

    const [aluno]: any = await pool.query(
      `SELECT id_aluno
       FROM aluno
       WHERE id_aluno = ?`,
      [dados.id_aluno],
    );

    if (aluno.length === 0) {
      return {
        mensagem: 'Aluno não encontrado',
      };
    }

    const [fichaExiste]: any = await pool.query(
      `SELECT id_ficha
       FROM ficha_aluno
       WHERE id_aluno = ?`,
      [dados.id_aluno],
    );

    if (fichaExiste.length > 0) {
      return {
        mensagem: 'Esse aluno já possui uma ficha',
      };
    }

    const objetivos = [
      'Funcional',
      'Hipertrofia',
      'Força máxima',
      'Resistência muscular',
    ];

    if (!objetivos.includes(dados.objetivo)) {
      return {
        mensagem: 'Objetivo inválido',
      };
    }

    const [resultado]: any = await pool.query(
      `INSERT INTO ficha_aluno
       (idade, peso, altura, objetivo, id_aluno)
       VALUES (?, ?, ?, ?, ?)`,
      [
        dados.idade,
        dados.peso,
        dados.altura,
        dados.objetivo,
        dados.id_aluno,
      ],
    );

    const [ficha]: any = await pool.query(
      `SELECT *
       FROM ficha_aluno
       WHERE id_ficha = ?`,
      [resultado.insertId],
    );

    return {
      mensagem: 'Ficha cadastrada com sucesso',
      ficha: ficha[0],
    };
  }

  async listar(
    usuarioId: number,
    tipoUsuario: string,
  ) {
    const pool = this.databaseService.getPool();

    if (tipoUsuario === 'aluno') {
      const [fichas]: any = await pool.query(
        `SELECT *
         FROM ficha_aluno
         WHERE id_aluno = ?`,
        [usuarioId],
      );

      return fichas;
    }

    const [fichas]: any = await pool.query(
      `SELECT f.*
       FROM ficha_aluno f
       INNER JOIN professor_aluno pa
         ON pa.id_aluno = f.id_aluno
       WHERE pa.id_professor = ?
       AND pa.status = 'Ativo'`,
      [usuarioId],
    );

    return fichas;
  }

  async buscarPorAluno(
    id_aluno: number,
    usuarioId: number,
    tipoUsuario: string,
  ) {
    const pool = this.databaseService.getPool();

    if (tipoUsuario === 'aluno' && id_aluno !== usuarioId) {
      return {
        mensagem: 'Você não tem acesso à ficha desse aluno',
      };
    }

    if (tipoUsuario === 'professor') {
      const [vinculo]: any = await pool.query(
        `SELECT id_professor_aluno
         FROM professor_aluno
         WHERE id_professor = ?
         AND id_aluno = ?
         AND status = 'Ativo'`,
        [usuarioId, id_aluno],
      );

      if (vinculo.length === 0) {
        return {
          mensagem: 'Você não está vinculado a esse aluno',
        };
      }
    }

    const [fichas]: any = await pool.query(
      `SELECT
         id_ficha,
         id_aluno,
         idade,
         peso,
         altura,
         objetivo,
         data_atualizacao
       FROM ficha_aluno
       WHERE id_aluno = ?
       LIMIT 1`,
      [id_aluno],
    );

    if (fichas.length === 0) {
      return {
        mensagem: 'Ficha não encontrada',
      };
    }

    return {
      ficha: fichas[0],
    };
  }

  async atualizar(
    id_aluno: number,
    dados: any,
    usuarioId: number,
    tipoUsuario: string,
  ) {
    const pool = this.databaseService.getPool();

    if (tipoUsuario === 'aluno' && id_aluno !== usuarioId) {
      return {
        mensagem: 'Você só pode atualizar sua própria ficha',
      };
    }

    if (tipoUsuario === 'professor') {
      const [vinculo]: any = await pool.query(
        `SELECT id_professor_aluno
         FROM professor_aluno
         WHERE id_professor = ?
         AND id_aluno = ?
         AND status = 'Ativo'`,
        [usuarioId, id_aluno],
      );

      if (vinculo.length === 0) {
        return {
          mensagem: 'Você não está vinculado a esse aluno',
        };
      }
    }

    const objetivos = [
      'Funcional',
      'Hipertrofia',
      'Força máxima',
      'Resistência muscular',
    ];

    if (!objetivos.includes(dados.objetivo)) {
      return {
        mensagem: 'Objetivo inválido',
      };
    }

    const [resultado]: any = await pool.query(
      `UPDATE ficha_aluno
       SET idade = ?,
           peso = ?,
           altura = ?,
           objetivo = ?
       WHERE id_aluno = ?`,
      [
        dados.idade,
        dados.peso,
        dados.altura,
        dados.objetivo,
        id_aluno,
      ],
    );

    if (resultado.affectedRows === 0) {
      return {
        mensagem: 'Ficha não encontrada',
      };
    }

    const [ficha]: any = await pool.query(
      `SELECT *
       FROM ficha_aluno
       WHERE id_aluno = ?`,
      [id_aluno],
    );

    return {
      mensagem: 'Ficha atualizada com sucesso',
      ficha: ficha[0],
    };
  }
}
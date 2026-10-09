import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlunoService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // =====================================================
  // CADASTRO
  // =====================================================

  async cadastro(dados: any) {
    const pool = this.databaseService.getPool();

    const nome = dados.nome.trim();
    const email = dados.email.trim().toLowerCase();
    const cpf = dados.cpf.replace(/\D/g, '');

    // Verifica se e-mail ou CPF já existem
    const [alunoExiste]: any = await pool.query(
      `
      SELECT id_aluno
      FROM aluno
      WHERE email = ? OR cpf = ?
      `,
      [email, cpf],
    );

    if (alunoExiste.length > 0) {
      return {
        mensagem: 'E-mail ou CPF já cadastrado',
      };
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(
      dados.senha,
      10,
    );

    // Insere no banco
    const [resultado]: any = await pool.query(
      `
      INSERT INTO aluno
      (nome, email, senha, cpf)
      VALUES (?, ?, ?, ?)
      `,
      [
        nome,
        email,
        senhaCriptografada,
        cpf,
      ],
    );

    return {
      mensagem: 'Aluno cadastrado com sucesso',

      aluno: {
        id: resultado.insertId,
        nome: nome,
        email: email,
        cpf: cpf,
      },
    };
  }

  // =====================================================
  // LOGIN
  // =====================================================

  async login(dados: any) {
    const pool = this.databaseService.getPool();

    const email = dados.email.trim().toLowerCase();
    const senha = dados.senha;

    console.log('=================================');
    console.log('LOGIN ALUNO');
    console.log('E-mail recebido:', email);
    console.log('Senha recebida:', senha ? 'SIM' : 'NÃO');
    console.log('=================================');

    const [alunos]: any = await pool.query(
      `
      SELECT
        id_aluno,
        nome,
        email,
        senha,
        cpf,
        data_cadastro
      FROM aluno
      WHERE email = ?
      `,
      [email],
    );

    // E-mail não encontrado
  // E-mail não encontrado no banco de dados
if (alunos.length === 0) {
    console.log('E-mail não cadastrado');

    return {
        mensagem: 'Este e-mail não está cadastrado. Faça seu cadastro para continuar.',
    };
}

    const aluno = alunos[0];

    console.log('Aluno encontrado:', aluno.email);
    console.log(
      'Hash armazenado:',
      aluno.senha,
    );

    // Verifica se existe senha no banco
    if (!aluno.senha) {
      console.log('Aluno não possui senha cadastrada');

      return {
        mensagem: 'E-mail ou senha incorretos',
      };
    }

    // Compara senha digitada com o hash
    const senhaCorreta = await bcrypt.compare(
      senha,
      aluno.senha,
    );

    console.log(
      'Senha correta:',
      senhaCorreta,
    );

    if (!senhaCorreta) {
      return {
        mensagem: 'E-mail ou senha incorretos',
      };
    }

    console.log('LOGIN REALIZADO COM SUCESSO');

    return {
      mensagem: 'Login realizado com sucesso',

      aluno: {
        id: aluno.id_aluno,
        nome: aluno.nome,
        email: aluno.email,
        cpf: aluno.cpf,
        data_cadastro: aluno.data_cadastro,
      },
    };
  }

  // =====================================================
  // LISTAR ALUNOS
  // =====================================================

  async listar(usuarioId: number, tipoUsuario: string) {
    const pool = this.databaseService.getPool();

    // Aluno vê apenas os próprios dados
    if (tipoUsuario === 'aluno') {
      const [alunos]: any = await pool.query(
        `
        SELECT
          id_aluno,
          nome,
          email,
          cpf,
          data_cadastro
        FROM aluno
        WHERE id_aluno = ?
        `,
        [usuarioId],
      );

      return alunos;
    }

    // Professor vê apenas os alunos vinculados a ele
    const [alunos]: any = await pool.query(
      `
      SELECT
        a.id_aluno,
        a.nome,
        a.email,
        a.cpf,
        a.data_cadastro
      FROM aluno a
      INNER JOIN professor_aluno pa
        ON pa.id_aluno = a.id_aluno
      WHERE pa.id_professor = ?
      AND pa.status = 'Ativo'
      ORDER BY a.id_aluno DESC
      `,
      [usuarioId],
    );

    return alunos;
  }

  // =====================================================
  // BUSCAR ALUNO POR ID
  // =====================================================

  async buscarPorId(
    id: number,
    usuarioId: number,
    tipoUsuario: string,
  ) {
    const pool = this.databaseService.getPool();

    // Aluno só pode consultar os próprios dados
    if (tipoUsuario === 'aluno' && id !== usuarioId) {
      return {
        mensagem: 'Você só pode consultar seus próprios dados',
      };
    }

    // Professor só pode consultar alunos vinculados a ele
    if (tipoUsuario === 'professor') {
      const [vinculo]: any = await pool.query(
        `
        SELECT id_professor_aluno
        FROM professor_aluno
        WHERE id_professor = ?
        AND id_aluno = ?
        AND status = 'Ativo'
        `,
        [usuarioId, id],
      );

      if (vinculo.length === 0) {
        return {
          mensagem: 'Você não está vinculado a esse aluno',
        };
      }
    }

    const [alunos]: any = await pool.query(
      `
      SELECT
        id_aluno,
        nome,
        email,
        cpf,
        data_cadastro
      FROM aluno
      WHERE id_aluno = ?
      `,
      [id],
    );

    if (alunos.length === 0) {
      return {
        mensagem: 'Aluno não encontrado',
      };
    }

    return alunos[0];
  }
}

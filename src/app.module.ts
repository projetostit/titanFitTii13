import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AlunoModule } from './aluno/aluno.module';
import { ProfessorModule } from './professor/professor.module';
import { FichaAlunoModule } from './ficha-aluno/ficha-aluno.module';
import { EvolucaoModule } from './evolucao/evolucao.module';
import { ExercicioModule } from './exercicio/exercicio.module';
import { TreinoModule } from './treino/treino.module';
import { DatabaseModule } from './database/database.module';
import { TreinoExercicioModule } from './treino-exercicio/treino-exercicio.module';
import { ProfessorAlunoModule } from './professor-aluno/professor-aluno.module';
import { PlanoModule } from './plano/plano.module';
import { AlunoPlanoModule } from './aluno-plano/aluno-plano.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    AlunoModule,
    ProfessorModule,
    FichaAlunoModule,
    EvolucaoModule,
    ExercicioModule,
    TreinoModule,
    DatabaseModule,
    TreinoExercicioModule,
    ProfessorAlunoModule,
    PlanoModule,
    AlunoPlanoModule,
    PagamentoModule,
    AuthModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}

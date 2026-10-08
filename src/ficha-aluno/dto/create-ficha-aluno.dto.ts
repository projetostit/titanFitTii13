
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class CreateFichaAlunoDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  idade: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  peso: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  altura: number;

  @IsNotEmpty()
  @IsString()
  objetivo: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  id_aluno: number;
}

import { IsEnum, IsNumber, IsOptional, IsString, Min, Max, MinLength, MaxLength, IsInt } from 'class-validator';
import { FinalidadeEmprestimo, SituacaoProfissional } from '../../../domain/entities/enums.js';
export class SolicitacaoDto {
  @IsString() @MinLength(3) @MaxLength(120) nomeCompleto!: string;
  @IsNumber() @Min(0.01) rendaMensal!: number;
  @IsNumber() @Min(100) @Max(1000000) valorSolicitado!: number;
  @IsInt() @Min(1) @Max(120) prazoMeses!: number;
  @IsEnum(SituacaoProfissional) situacaoProfissional!: SituacaoProfissional;
  @IsEnum(FinalidadeEmprestimo) finalidade!: FinalidadeEmprestimo;
  @IsOptional() @IsString() @MaxLength(1000) observacoes?: string;
}

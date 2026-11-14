import { IsBoolean, IsNumber, IsOptional, IsString, Min, MaxLength, MinLength } from 'class-validator';
export class AvaliarSolicitacaoDto {
  @IsBoolean() aprovada!: boolean;
  @IsOptional() @IsNumber() @Min(0.01) valorAprovado?: number;
  @IsString() @MinLength(3) @MaxLength(1000) parecer!: string;
}

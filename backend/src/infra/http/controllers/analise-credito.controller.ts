import { SolicitacaoRepository } from '../../../domain/repositories/solicitacao.repository.js';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { AvaliarSolicitacaoUseCase } from '../../../application/use-cases/avaliar-solicitacao.use-case.js';
import { ListarFilaAnaliseUseCase } from '../../../application/use-cases/listar-fila-analise.use-case.js';
import { UsuarioId } from '../decorators/usuario-id.decorator.js';
import { AvaliarSolicitacaoDto } from '../dtos/avaliar-solicitacao.dto.js';
import { Papeis, RolesGuard } from '../guards/roles.guard.js';
@Controller('analise-credito') @UseGuards(RolesGuard) @Papeis('ANALISTA')
export class AnaliseCreditoController {
  constructor(private readonly filaCaso: ListarFilaAnaliseUseCase, private readonly avaliarCaso: AvaliarSolicitacaoUseCase, private readonly repository: SolicitacaoRepository) {}
  @Get('fila') fila() { return this.filaCaso.executar(); }
  @Get(':id/auditoria') auditoria(@Param('id', ParseUUIDPipe) id: string) { return this.repository.listarAuditoria(id); }
  @Patch(':id/avaliar') avaliar(@Param('id', ParseUUIDPipe) id: string, @UsuarioId() analistaId: string, @Body() dto: AvaliarSolicitacaoDto) { return this.avaliarCaso.executar(id, analistaId, dto); }
}

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { AtualizarSolicitacaoUseCase } from '../../../application/use-cases/atualizar-solicitacao.use-case.js';
import { BuscarSolicitacaoUseCase } from '../../../application/use-cases/buscar-solicitacao.use-case.js';
import { CriarSolicitacaoUseCase } from '../../../application/use-cases/criar-solicitacao.use-case.js';
import { ExcluirSolicitacaoUseCase } from '../../../application/use-cases/excluir-solicitacao.use-case.js';
import { ListarSolicitacoesUseCase } from '../../../application/use-cases/listar-solicitacoes.use-case.js';
import { UsuarioId } from '../decorators/usuario-id.decorator.js';
import { SolicitacaoDto } from '../dtos/solicitacao.dto.js';
@Controller('solicitacoes')
export class SolicitacoesController {
  constructor(private readonly criarCaso: CriarSolicitacaoUseCase, private readonly listarCaso: ListarSolicitacoesUseCase, private readonly buscarCaso: BuscarSolicitacaoUseCase, private readonly atualizarCaso: AtualizarSolicitacaoUseCase, private readonly excluirCaso: ExcluirSolicitacaoUseCase) {}
  @Post() criar(@UsuarioId() id: string, @Body() dto: SolicitacaoDto) { return this.criarCaso.executar(id, dto); }
  @Get() listar(@UsuarioId() id: string) { return this.listarCaso.executar(id); }
  @Get(':id') buscar(@Param('id', ParseUUIDPipe) id: string, @UsuarioId() usuarioId: string) { return this.buscarCaso.executar(id, usuarioId); }
  @Put(':id') atualizar(@Param('id', ParseUUIDPipe) id: string, @UsuarioId() usuarioId: string, @Body() dto: SolicitacaoDto) { return this.atualizarCaso.executar(id, usuarioId, dto); }
  @Delete(':id') @HttpCode(HttpStatus.NO_CONTENT) excluir(@Param('id', ParseUUIDPipe) id: string, @UsuarioId() usuarioId: string) { return this.excluirCaso.executar(id, usuarioId); }
}

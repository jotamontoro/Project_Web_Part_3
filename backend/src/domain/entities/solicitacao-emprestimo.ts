import { PermissaoNegadaError, RegraDeNegocioError } from '../errors/domain.errors.js';
import { FinalidadeEmprestimo, SituacaoProfissional, StatusSolicitacao } from './enums.js';

export interface DadosSolicitacao {
  nomeCompleto: string; rendaMensal: number; valorSolicitado: number; prazoMeses: number;
  situacaoProfissional: SituacaoProfissional; finalidade: FinalidadeEmprestimo; observacoes?: string;
}
export interface DadosAnalise { aprovada: boolean; valorAprovado?: number; parecer: string; }
export interface AnaliseCredito extends DadosAnalise { analistaId: string; analisadaEm: string; }
export interface SolicitacaoProps extends DadosSolicitacao {
  id: string; solicitanteId: string; status: StatusSolicitacao; criadaEm: string; atualizadaEm?: string; analise?: AnaliseCredito;
}

export class SolicitacaoEmprestimo implements SolicitacaoProps {
  id: string; solicitanteId: string; nomeCompleto: string; rendaMensal: number; valorSolicitado: number;
  prazoMeses: number; situacaoProfissional: SituacaoProfissional; finalidade: FinalidadeEmprestimo;
  observacoes?: string; status: StatusSolicitacao; criadaEm: string; atualizadaEm?: string; analise?: AnaliseCredito;
  constructor(props: SolicitacaoProps) { Object.assign(this, props); }
  static criar(id: string, solicitanteId: string, dados: DadosSolicitacao): SolicitacaoEmprestimo {
    this.validar(dados);
    return new SolicitacaoEmprestimo({ ...dados, id, solicitanteId, nomeCompleto: dados.nomeCompleto.trim(), observacoes: dados.observacoes?.trim() || undefined, status: StatusSolicitacao.PENDENTE, criadaEm: new Date().toISOString() });
  }
  estaPendente(): boolean { return this.status === StatusSolicitacao.PENDENTE; }
  editar(solicitanteId: string, dados: DadosSolicitacao): void {
    this.verificarPermissao(solicitanteId); SolicitacaoEmprestimo.validar(dados);
    this.nomeCompleto = dados.nomeCompleto.trim(); this.rendaMensal = dados.rendaMensal; this.valorSolicitado = dados.valorSolicitado;
    this.prazoMeses = dados.prazoMeses; this.situacaoProfissional = dados.situacaoProfissional; this.finalidade = dados.finalidade;
    this.observacoes = dados.observacoes?.trim() || undefined; this.atualizadaEm = new Date().toISOString();
  }
  verificarPermissao(solicitanteId: string): void {
    if (this.solicitanteId !== solicitanteId) throw new PermissaoNegadaError('Você só pode alterar ou excluir suas próprias solicitações.');
    if (!this.estaPendente()) throw new RegraDeNegocioError('Esta solicitação já foi analisada e não pode mais ser alterada.');
  }
  /** Únicas transições permitidas: PENDENTE -> APROVADA ou REPROVADA. */
  aprovar(analistaId: string, valorAprovado: number, parecer: string): void {
    this.validarAnalista(analistaId);
    if (!Number.isFinite(valorAprovado) || valorAprovado <= 0 || valorAprovado > this.valorSolicitado)
      throw new RegraDeNegocioError('O valor aprovado deve ser maior que zero e não pode superar o valor solicitado.');
    // Regra simplificada do CredFácil: parcela sem juros de até 30% da renda mensal.
    // Não representa uma simulação bancária real (não inclui juros ou tarifas).
    const parcelaEstimada = valorAprovado / this.prazoMeses;
    if (parcelaEstimada > this.rendaMensal * 0.30)
      throw new RegraDeNegocioError('A parcela estimada supera 30% da renda mensal do solicitante.');
    this.registrarAnalise(analistaId, true, parecer, valorAprovado);
  }
  reprovar(analistaId: string, parecer: string): void {
    this.validarAnalista(analistaId);
    this.registrarAnalise(analistaId, false, parecer);
  }
  /** Mantém a interface atual utilizada pelo caso de uso e pelo controller. */
  avaliar(analistaId: string, dados: DadosAnalise): void {
    if (dados.aprovada) this.aprovar(analistaId, dados.valorAprovado as number, dados.parecer);
    else this.reprovar(analistaId, dados.parecer);
  }
  private validarAnalista(analistaId: string): void {
    if (!this.estaPendente()) throw new RegraDeNegocioError('Esta solicitação já foi analisada.');
    if (!analistaId?.trim()) throw new PermissaoNegadaError('Identificação do analista é obrigatória.');
    if (this.solicitanteId === analistaId) throw new PermissaoNegadaError('Você não pode analisar sua própria solicitação.');
  }
  private registrarAnalise(analistaId: string, aprovada: boolean, parecer: string, valorAprovado?: number): void {
    if (!parecer?.trim() || parecer.trim().length < 3) throw new RegraDeNegocioError('O parecer da análise deve conter pelo menos 3 caracteres.');
    const instante = new Date().toISOString();
    this.status = aprovada ? StatusSolicitacao.APROVADA : StatusSolicitacao.REPROVADA;
    this.analise = { analistaId, aprovada, valorAprovado, parecer: parecer.trim(), analisadaEm: instante };
    this.atualizadaEm = instante;
  }
  private static validar(d: DadosSolicitacao): void {
    if (!d.nomeCompleto?.trim() || d.nomeCompleto.trim().length < 3) throw new RegraDeNegocioError('Informe o nome completo do solicitante.');
    if (!Number.isFinite(d.rendaMensal) || d.rendaMensal <= 0) throw new RegraDeNegocioError('A renda mensal deve ser maior que zero.');
    if (!Number.isFinite(d.valorSolicitado) || d.valorSolicitado < 100 || d.valorSolicitado > 1000000) throw new RegraDeNegocioError('O valor solicitado deve estar entre R$ 100 e R$ 1.000.000.');
    if (!Number.isInteger(d.prazoMeses) || d.prazoMeses < 1 || d.prazoMeses > 120) throw new RegraDeNegocioError('O prazo deve estar entre 1 e 120 meses.');
    if (!d.situacaoProfissional || !Object.values(SituacaoProfissional).includes(d.situacaoProfissional)) throw new RegraDeNegocioError('Informe uma situação profissional válida.');
    if (!d.finalidade || !Object.values(FinalidadeEmprestimo).includes(d.finalidade)) throw new RegraDeNegocioError('Informe uma finalidade válida.');
  }
}

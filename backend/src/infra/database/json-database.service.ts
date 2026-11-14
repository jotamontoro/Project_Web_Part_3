import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
type Banco = Record<string, unknown[]>;
@Injectable()
export class JsonDatabaseService implements OnModuleInit {
  private readonly arquivo = process.env.DB_ARQUIVO ?? join(process.cwd(), 'data', 'db.json');
  private fila: Promise<unknown> = Promise.resolve();
  async onModuleInit() { await fs.mkdir(dirname(this.arquivo), { recursive: true }); try { await fs.access(this.arquivo); } catch { await this.gravar({ solicitacoes: [] }); } }
  async ler<T>(colecao: string): Promise<T[]> { await this.fila; const banco = await this.lerTudo(); return (banco[colecao] ?? []) as T[]; }
  alterar<T>(colecao: string, alteracao: (itens: T[]) => T[]): Promise<void> { const operacao = this.fila.then(async () => { const banco = await this.lerTudo(); banco[colecao] = alteracao((banco[colecao] ?? []) as T[]); await this.gravar(banco); }); this.fila = operacao.catch(() => undefined); return operacao; }
  alterarBanco(alteracao: (banco: Banco) => void): Promise<void> {
    const operacao = this.fila.then(async () => {
      const banco = await this.lerTudo();
      alteracao(banco);
      await this.gravar(banco);
    });
    this.fila = operacao.catch(() => undefined);
    return operacao;
  }
  private async lerTudo(): Promise<Banco> { const conteudo = await fs.readFile(this.arquivo, 'utf-8'); return JSON.parse(conteudo) as Banco; }
  private async gravar(banco: Banco): Promise<void> { await fs.writeFile(this.arquivo, JSON.stringify(banco, null, 2)); }
}

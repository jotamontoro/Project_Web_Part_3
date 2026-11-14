import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
const PAPEIS_KEY = 'papeis';
export const Papeis = (...papeis: string[]) => SetMetadata(PAPEIS_KEY, papeis);
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean { const exigidos = this.reflector.getAllAndOverride<string[]>(PAPEIS_KEY, [context.getHandler(), context.getClass()]) ?? []; if (!exigidos.length) return true; const request = context.switchToHttp().getRequest<{ headers: Record<string,string> }>(); const papel = request.headers['x-role']; if (!papel || !exigidos.includes(papel)) throw new ForbiddenException('Você não possui permissão para acessar este recurso.'); return true; }
}

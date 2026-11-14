import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ConflitoError, DomainError, NaoEncontradoError, PermissaoNegadaError } from '../../../domain/errors/domain.errors.js';
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(erro: DomainError, host: ArgumentsHost) { const response = host.switchToHttp().getResponse<Response>(); const status = erro instanceof NaoEncontradoError ? HttpStatus.NOT_FOUND : erro instanceof PermissaoNegadaError ? HttpStatus.FORBIDDEN : erro instanceof ConflitoError ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST; response.status(status).json({ statusCode: status, message: erro.message }); }
}

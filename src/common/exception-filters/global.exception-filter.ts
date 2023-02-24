import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import { Logger } from '../../core/logger'
import { ExceptionResponse } from '../response/exception-response'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    this.logger.error('Unhandled exception', exception)

    const exceptionResponse = this.getResponseBody()

    response.status(exceptionResponse.code).send(exceptionResponse)
  }

  private getResponseBody(): ExceptionResponse {
    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
    }
  }
}

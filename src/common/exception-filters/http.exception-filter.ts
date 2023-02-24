import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { AppException } from '../exceptions/app.exception'
import { ExceptionResponse } from '../response/exception-response'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const exceptionResponse = this.getResponseBody(exception)

    response.status(exceptionResponse.code).send(exceptionResponse)
  }

  private getResponseBody(exception: HttpException): ExceptionResponse {
    if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      }
    }

    return {
      code: exception.getStatus(),
      message: exception.message,
      timestamp: new Date().toISOString(),
    }
  }
}

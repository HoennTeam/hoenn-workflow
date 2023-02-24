import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import { AppException } from '../exceptions/app.exception'
import { ExceptionResponse } from '../response/exception-response'

@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter {
  public catch(exception: AppException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const exceptionResponse = this.getResponseBody(exception)

    response.status(exceptionResponse.code).send(exceptionResponse)
  }

  private getResponseBody(exception: AppException): ExceptionResponse {
    if (exception.code === HttpStatus.INTERNAL_SERVER_ERROR) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      }
    }

    return {
      code: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
      details: exception.details,
    }
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Logger } from '../../core/logger'
import { Observable, catchError, throwError } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Config } from '../../core/config'

@Injectable()
export default class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    const http = context.switchToHttp()
    const request = http.getRequest()

    if (this.config.logging.logRequests) {
      this.logger.debug('Incoming request: ', {
        params: request.params,
        body: request.body,
        query: request.query,
        headers: request.headers,
        url: request.url,
      })
    }

    return next.handle().pipe(
      tap((data) => {
        const response = http.getResponse()

        if (this.config.logging.logRequests) {
          this.logger.debug('Response: ', {
            url: request.url,
            response: data,
            code: response.statusCode,
          })
        }
      }),
      catchError((err) => {
        const response = http.getResponse()

        if (this.config.logging.logRequests) {
          this.logger.debug('Request error: ', {
            url: request.url,
            code: response.statusCode,
          })
        }
        return throwError(err)
      })
    )
  }
}

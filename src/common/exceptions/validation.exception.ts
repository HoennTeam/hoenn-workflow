import { HttpStatus } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { AppException } from './app.exception'

export class ValidationException extends AppException {
  constructor(errors: ValidationError[]) {
    super(HttpStatus.BAD_REQUEST, 'Validation error', { errors })
  }
}

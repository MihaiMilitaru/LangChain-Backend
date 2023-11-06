import { HttpException } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('User already registered', 400);
  }
}

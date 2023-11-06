import { Config } from './config.interface';

const config: Config = {
  application: {
    name: 'NestJS Boilerplate API',
    description: 'The NestJS Boilerplate API',
    version: '1.0',
    host: '127.0.0.1',
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'NestJS API',
    description: 'The NestJS API',
    version: '1.0',
    path: 'docs',
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    inviteExpiresIn: '7d',
    passwordResetExpiresIn: '15m',
  },
};

export default (): Config => config;

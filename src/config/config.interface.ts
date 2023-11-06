export interface Config {
  application: AppConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  security: SecurityConfig;
}

export interface AppConfig {
  name: string;
  description: string;
  version: string;
  host: string;
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title?: string;
  description?: string;
  version?: string;
  path: string;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  inviteExpiresIn: string;
  passwordResetExpiresIn: string;
}

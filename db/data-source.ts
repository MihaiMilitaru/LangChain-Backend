import { DataSource, DataSourceOptions } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotEnv = require('dotenv');

dotEnv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: false,
};

const dataSource: DataSource = new DataSource(dataSourceOptions);
export default dataSource;

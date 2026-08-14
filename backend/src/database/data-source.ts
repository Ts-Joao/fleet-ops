import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
  type: 'postgres',

  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [
    'src/**/*.entity.ts'
  ],

  migrations: [
    'src/database/migrations/*.ts'
  ],
})
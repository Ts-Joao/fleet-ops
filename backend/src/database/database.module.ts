import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,

      autoLoadEntities: true,

      synchronize: false,
    })
  ]
})
export class DatabaseModule {}
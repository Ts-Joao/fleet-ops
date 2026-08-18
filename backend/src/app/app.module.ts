import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriverModule } from '@driver/driver.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, DriverModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

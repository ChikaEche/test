import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpreakerService } from './spreaker/spreaker.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ScheduleModule.forRoot(), ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, SpreakerService],
})
export class AppModule {}

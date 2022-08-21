import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpreakerService } from './spreaker/spreaker.service';
import { ConfigModule } from '@nestjs/config';
import { SpotifyService } from './spotify/spotify.service';
import { JiosaavnService } from './jiosaavn/jiosaavn.service';
import { IHeartService } from './i-heart/i-heart.service';

@Module({
  imports: [ ScheduleModule.forRoot(), ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, SpreakerService, SpotifyService, JiosaavnService, IHeartService],
})
export class AppModule {}

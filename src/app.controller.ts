import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from '@nestjs/common';

@Controller()
export class AppController {
  private readonly LOGGER = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {
    this.LOGGER.log("STARTING....")
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

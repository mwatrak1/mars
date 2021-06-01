import { Module } from '@nestjs/common';
import { ApodController } from './apod.controller';
import { ApodService } from './apod.service';

@Module({
  controllers: [ApodController],
  providers: [ApodService]
})
export class ApodModule {}

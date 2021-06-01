import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApodController } from './apod.controller';
import { Apod, apodSchema } from './apod.schema';
import { ApodService } from './apod.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Apod.name, schema: apodSchema }]),
  ],
  controllers: [ApodController],
  providers: [ApodService],
})
export class ApodModule {}

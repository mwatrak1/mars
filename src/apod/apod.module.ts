import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ApodController } from './apod.controller';
import { Apod, apodSchema } from './apod.schema';
import { ApodService } from './apod.service';
import { ApodUpdateService } from './apod.update.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Apod.modelName, schema: apodSchema }]),
    ConfigModule,
  ],
  controllers: [ApodController],
  providers: [ApodService, ApodUpdateService],
})
export class ApodModule {}

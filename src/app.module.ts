import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { ApodModule } from './apod/apod.module';
import { GalleryModule } from './gallery/gallery.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    WeatherModule,
    ApodModule,
    GalleryModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_HOST),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

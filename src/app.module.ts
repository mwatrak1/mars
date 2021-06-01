import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { ApodModule } from './apod/apod.module';
import { GalleryModule } from './gallery/gallery.module';

@Module({
  imports: [WeatherModule, ApodModule, GalleryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

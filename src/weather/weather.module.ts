import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherController } from './weather.controller';
import { Weather, weatherSchema } from './weather.schema';
import { WeatherService } from './weather.service';
import { WeatherUpdateService } from './weather.update.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Weather.modelName, schema: weatherSchema },
    ]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherUpdateService],
})
export class WeatherModule {}

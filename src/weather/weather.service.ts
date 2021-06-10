import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDoc } from './weather.schema';
@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.modelName) private weatherModel: Model<WeatherDoc>,
  ) {}

  async getWeather() {
    const weather = await this.weatherModel
      .find()
      .sort({ date: -1 })
      .limit(1)
      .exec();

    return weather;
  }
}

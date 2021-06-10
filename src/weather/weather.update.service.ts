import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDoc, WeatherAttrs } from './weather.schema';
import { Cron } from '@nestjs/schedule';
import axios, { AxiosResponse } from 'axios';
import { MarsWeather, WeatherResponse } from './types/weather-response.type';

@Injectable()
export class WeatherUpdateService {
  private readonly NASA_WEATHER_URL =
    'https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json';

  constructor(
    @InjectModel(Weather.modelName) private weatherModel: Model<WeatherDoc>,
  ) {}

  @Cron('0 0 12 * * *')
  private async update() {
    const response = await this.getWeatherData();
    await this.createWeathers(response);
  }

  private async createWeathers(weatherResponse: WeatherResponse) {
    for (const weather of weatherResponse.sols) {
      const weatherObject = this.assembleWeatherObject(weather);
      try {
        (await this.weatherModel.create(weatherObject)).save();
      } catch (error) {
        Logger.log(
          'Document with given date already exists or there was another error while saving a document',
        );
      }
    }
  }

  private assembleWeatherObject(marsWeather: MarsWeather): WeatherAttrs {
    const {
      terrestrial_date,
      sol,
      ls,
      season,
      min_temp,
      max_temp,
      pressure,
      sunrise,
      sunset,
    } = marsWeather;

    const date = new Date(terrestrial_date);

    return {
      date,
      sol,
      ls,
      season,
      min_temp,
      max_temp,
      pressure,
      sunrise,
      sunset,
    };
  }

  private async getWeatherData(): Promise<WeatherResponse> {
    let response: AxiosResponse<WeatherResponse>;
    try {
      response = await axios.get(this.NASA_WEATHER_URL);
    } catch (error) {
      Logger.log('Error while getting Weather update');
      Logger.error(error);
      return { sols: [] };
    }
    return response.data;
  }
}

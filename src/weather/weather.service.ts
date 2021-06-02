import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Weather, WeatherAttrs, WeatherDoc } from './weather.schema';
import axios from 'axios';
import { MarsWeather, WeatherResponse } from './types/weather-response.type';
@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.modelName) private weatherModel: Model<WeatherDoc>,
  ) {}

  @Cron('0 0 12 * * *')
  private async update() {
    const response = await this.performRequest();
    this.createWeathers(response);
  }

  getWeather() {
    return this.weatherModel.find().sort({ date: -1 }).limit(1).exec();
  }

  private async createWeathers(weatherResponse: WeatherResponse) {
    for (const weather of weatherResponse.sols) {
      const weatherObject = this.assembleWeatherObject(weather);
      try {
        (await this.weatherModel.create(weatherObject)).save();
      } catch (error) {
        console.log('Document already exists');
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

  private async performRequest(): Promise<WeatherResponse> {
    const nasaWeatherUrl = `https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json`;
    return (await axios.get(nasaWeatherUrl)).data;
  }
}

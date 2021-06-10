import { Controller, Get, NotFoundException } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  async getWeather() {
    const weather = await this.weatherService.getWeather();
    if (weather.length === 0) {
      throw new NotFoundException('Sorry, the weather is not available');
    }
    return weather[0];
  }
}

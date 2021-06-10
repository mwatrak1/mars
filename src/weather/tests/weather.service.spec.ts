import { Test } from '@nestjs/testing';
import { WeatherService } from '../weather.service';
import { Weather, WeatherModel } from '../weather.schema';
import { getModelToken } from '@nestjs/mongoose';
import { sampleMarsWeatherDoc } from './sampleObjects';

const mockWeatherModel = () => ({
  find: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn().mockReturnThis(),
  create: jest.fn().mockReturnThis(),
  save: jest.fn(),
});

describe('WeatherService test', () => {
  let weatherService: WeatherService;
  let weatherModel: WeatherModel | any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: getModelToken(Weather.modelName),
          useFactory: mockWeatherModel,
        },
      ],
    }).compile();

    weatherService = moduleRef.get<WeatherService>(WeatherService);
    weatherModel = moduleRef.get(Weather.modelName + 'Model');
  });

  describe('getWeather test', () => {
    it('should get the latest weather available', async () => {
      weatherModel.exec.mockResolvedValue(sampleMarsWeatherDoc);
      const result = await weatherService.getWeather();
      expect(result).toEqual(sampleMarsWeatherDoc);
      expect(weatherModel.find).toHaveBeenCalled();
      expect(weatherModel.sort).toHaveBeenCalled();
      expect(weatherModel.limit).toHaveBeenCalled();
      expect(weatherModel.exec).toHaveBeenCalled();
    });

    it('should return an emplty array no weather data is available', async () => {
      weatherModel.exec.mockResolvedValue([]);
      const result = await weatherService.getWeather();
      expect(result).toEqual([]);
      expect(weatherModel.find).toHaveBeenCalled();
      expect(weatherModel.sort).toHaveBeenCalled();
      expect(weatherModel.limit).toHaveBeenCalled();
      expect(weatherModel.exec).toHaveBeenCalled();
    });
  });
});

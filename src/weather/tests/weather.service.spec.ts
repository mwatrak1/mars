import { Test } from '@nestjs/testing';
import { WeatherService } from '../weather.service';
import { Weather, WeatherModel } from '../weather.schema';

const mockWeatherModel = () => ({
  find: jest.fn(),
});

console.log(Weather.modelName);
describe('WeatherService test', () => {
  let weatherService: WeatherService;
  let weatherModel: WeatherModel | any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: Weather.modelName, useFactory: mockWeatherModel },
      ],
    }).compile();

    weatherService = moduleRef.get<WeatherService>(WeatherService);
    weatherModel = moduleRef.get(Weather.modelName + 'Model');
  });

  describe('getPhotos test', () => {
    it('should get all available photos without using request queries', async () => {
      weatherModel.find.mockResolvedValue({});
      const result = weatherService.getWeather();
      console.log(result);
      expect(weatherModel.find).toHaveBeenCalled();
    });
  });
});

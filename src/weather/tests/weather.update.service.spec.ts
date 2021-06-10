import { Test } from '@nestjs/testing';
import { WeatherUpdateService } from '../weather.update.service';
import { Weather, WeatherModel } from '../weather.schema';
import { getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { sampleMarsWeatherResponse } from './sampleObjects';

const mockWeatherModel = () => ({
  find: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn().mockReturnThis(),
  create: jest.fn().mockReturnThis(),
  save: jest.fn(),
});

describe('weatherUpdateService test', () => {
  let weatherUpdateService: WeatherUpdateService;
  let weatherModel: WeatherModel | any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        WeatherUpdateService,
        {
          provide: getModelToken(Weather.modelName),
          useFactory: mockWeatherModel,
        },
      ],
    }).compile();

    weatherUpdateService =
      moduleRef.get<WeatherUpdateService>(WeatherUpdateService);
    weatherModel = moduleRef.get(Weather.modelName + 'Model');
  });

  describe('createWeather test', () => {
    it('creates and saves a weather given valid weatherResponse data and no duplicate date', async () => {
      await weatherUpdateService['createWeathers'](sampleMarsWeatherResponse);
      expect(weatherModel.create).toHaveBeenCalledTimes(
        sampleMarsWeatherResponse.sols.length,
      );
      expect(weatherModel.save).toHaveBeenCalledTimes(
        sampleMarsWeatherResponse.sols.length,
      );
      expect(weatherModel.save).not.toThrow();
    });

    it('throws an error given invalid weatherResponse data or duplicate date', async () => {
      weatherModel.save.mockImplementation(() => {
        throw new mongoose.Error('MongooseError');
      });
      try {
        await weatherUpdateService['createWeathers'](sampleMarsWeatherResponse);
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error);
        expect(weatherModel.save).toThrow(mongoose.Error);
      }
    });
  });

  describe('Weather update CRON JOB test', () => {
    it('should create weather object(s) in a DB if requests returned an array of weather objects', async () => {
      jest
        .spyOn<any, string>(weatherUpdateService, 'getWeatherData')
        .mockImplementation(() => sampleMarsWeatherResponse);
      jest.spyOn<any, string>(weatherUpdateService, 'createWeathers');
      await weatherUpdateService['update']();
      expect(weatherUpdateService['createWeathers']).toHaveBeenCalled();
      expect(weatherModel.save).toHaveBeenCalledTimes(
        sampleMarsWeatherResponse.sols.length,
      );
    });

    it('should not create any weather objects(s) if there was no new weather date available', async () => {
      jest
        .spyOn<any, string>(weatherUpdateService, 'getWeatherData')
        .mockImplementation(() => {
          return { sols: [] };
        });
      jest.spyOn<any, string>(weatherUpdateService, 'createWeathers');
      await weatherUpdateService['update']();
      expect(weatherModel.save).not.toHaveBeenCalled();
    });

    it('should not create any weather object(s)if there were any errors while performing request', async () => {
      jest
        .spyOn<any, string>(weatherUpdateService, 'getWeatherData')
        .mockImplementation(() => {
          return { sols: [] };
        });
      jest.spyOn<any, string>(weatherUpdateService, 'createWeathers');
      await weatherUpdateService['update']();
      expect(weatherModel.save).not.toHaveBeenCalled();
    });
  });
});

import { Test } from '@nestjs/testing';
import { WeatherService } from '../weather.service';
import { Weather, WeatherModel } from '../weather.schema';
import { getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import {
  sampleMarsWeatherDoc,
  sampleMarsWeatherResponse,
} from './sampleObjects';

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
      weatherModel.exec.mockResolvedValue([sampleMarsWeatherDoc]);
      const result = await weatherService.getWeather();
      expect(result).toEqual(sampleMarsWeatherDoc);
      expect(weatherModel.find).toHaveBeenCalled();
      expect(weatherModel.sort).toHaveBeenCalled();
      expect(weatherModel.limit).toHaveBeenCalled();
      expect(weatherModel.exec).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no weather data is available', async () => {
      jest.spyOn<any, string>(weatherService, 'getWeather');
      weatherModel.exec.mockResolvedValue([]);
      try {
        await weatherService.getWeather();
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
      expect(weatherModel.find).toHaveBeenCalled();
      expect(weatherModel.sort).toHaveBeenCalled();
      expect(weatherModel.limit).toHaveBeenCalled();
      expect(weatherModel.exec).toHaveBeenCalled();
    });
  });

  describe('createWeather test', () => {
    it('creates and saves a weather given valid weatherResponse data and no duplicate date', async () => {
      await weatherService['createWeathers'](sampleMarsWeatherResponse);
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
        await weatherService['createWeathers'](sampleMarsWeatherResponse);
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error);
        expect(weatherModel.save).toThrow(mongoose.Error);
      }
    });
  });

  describe('Weather update CRON JOB test', () => {
    it('should create weather object(s) in a DB if requests returned an array of weather objects', async () => {
      jest
        .spyOn<any, string>(weatherService, 'performRequest')
        .mockImplementation(() => sampleMarsWeatherResponse);
      jest.spyOn<any, string>(weatherService, 'createWeathers');
      await weatherService['update']();
      expect(weatherService['createWeathers']).toHaveBeenCalled();
      expect(weatherModel.save).toHaveBeenCalledTimes(
        sampleMarsWeatherResponse.sols.length,
      );
    });

    it('should not create any weather objects(s) if there was no new weather date available', async () => {
      jest
        .spyOn<any, string>(weatherService, 'performRequest')
        .mockImplementation(() => {
          return { sols: [] };
        });
      jest.spyOn<any, string>(weatherService, 'createWeathers');
      await weatherService['update']();
      expect(weatherModel.save).not.toHaveBeenCalled();
    });

    it('should not create any weather object(s)if there were any errors while performing request', async () => {
      jest
        .spyOn<any, string>(weatherService, 'performRequest')
        .mockImplementation(() => {
          return { sols: [] };
        });
      jest.spyOn<any, string>(weatherService, 'createWeathers');
      await weatherService['update']();
      expect(weatherModel.save).not.toHaveBeenCalled();
    });
  });
});

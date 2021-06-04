import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Apod, ApodModel } from '../apod.schema';
import { ApodService } from '../apod.service';
import * as mongoose from 'mongoose';
import {
  sampleApodAttrs,
  sampleApodDoc,
  sampleDateDto,
  apodResponseValidData,
} from './sampleObjects';

export const mockApodModel = () => ({
  findOne: jest.fn(),
  create: jest.fn().mockReturnThis(),
  save: jest.fn(),
});

describe('ApodService test', () => {
  let apodService: ApodService;
  let apodModel: ApodModel | any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ApodService,
        { provide: getModelToken(Apod.modelName), useFactory: mockApodModel },
      ],
    }).compile();

    apodService = moduleRef.get(Apod.modelName + 'Service');
    apodModel = moduleRef.get(Apod.modelName + 'Model');
  });

  describe('getApod test', () => {
    it('should get the latest APOD given valid query', async () => {
      apodModel.findOne.mockResolvedValue(sampleApodDoc);
      const result = await apodService.getApod();
      expect(result).toEqual(sampleApodDoc);
      expect(apodModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('no APOD found - should throw bad request exception', async () => {
      apodModel.findOne.mockResolvedValue(undefined);

      try {
        await apodService.getApod();
        throw new Error('Test failed');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.response.message).toBe(
          'Sorry the APOD for current date is not available',
        );
        expect(err.response.statusCode).toBe(404);
      }
    });
  });

  describe('getApodByDate test', () => {
    it('should get the APOD given valid date', async () => {
      apodModel.findOne.mockResolvedValue(sampleApodDoc);
      const result = await apodService.getApodByDate(sampleDateDto);
      expect(result).toEqual(sampleApodDoc);
      expect(apodModel.findOne).toHaveBeenCalledTimes(1);
      expect(apodModel.findOne).toHaveBeenCalledWith(sampleDateDto);
    });
  });

  it('no APOD with given date - should throw bad request exception', async () => {
    apodModel.findOne.mockResolvedValue(undefined);
    try {
      await apodService.getApodByDate(sampleDateDto);
      throw new Error('Test failed');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.response.message).toBe('APOD for this date not found');
      expect(err.response.statusCode).toBe(404);
    }
  });

  describe('createApod test', () => {
    it('should create and save a pod given valid response data', async () => {
      apodModel.save.mockResolvedValue(sampleApodAttrs);
      const result = await apodService['createApod'](apodResponseValidData);
      expect(result).toEqual(sampleApodAttrs);
      expect(apodModel.create).toHaveBeenCalled();
      expect(apodModel.save).toHaveBeenCalled();
      expect(apodModel.save).not.toThrow();
    });

    it('should throw an error given already existing apod', async () => {
      apodModel.save.mockImplementation(() => {
        throw new mongoose.Error('MongooseError');
      });
      await apodService['createApod'](apodResponseValidData);
      expect(apodModel.save).toThrow(mongoose.Error);
    });
  });

  describe('APOD update CRON JOB test', () => {
    it('succesfully updates APOD DB', async () => {
      jest
        .spyOn<any, string>(apodService, 'performRequest')
        .mockImplementation(() => apodResponseValidData);
      jest.spyOn<any, string>(apodService, 'createApod');
      await apodService['update']();
      expect(apodService['createApod']).toHaveBeenCalled();
      expect(apodModel.save).toHaveBeenCalled();
    });

    it('succesfully makes a request that returns an empty array - no new APODs', async () => {
      jest
        .spyOn<any, string>(apodService, 'performRequest')
        .mockImplementation(() => []);
      jest.spyOn<any, string>(apodService, 'createApod');
      await apodService['update']();
      expect(apodModel.save).not.toHaveBeenCalled();
      expect(apodService['createApod']).not.toHaveBeenCalled();
    });

    it('makes an unsuccesfull request', async () => {
      jest
        .spyOn<any, string>(apodService, 'performRequest')
        .mockImplementation(() => undefined);
      jest.spyOn<any, string>(apodService, 'createApod');
      await apodService['update']();
      expect(apodModel.save).not.toHaveBeenCalled();
      expect(apodService['createApod']).not.toHaveBeenCalled();
    });
  });
});

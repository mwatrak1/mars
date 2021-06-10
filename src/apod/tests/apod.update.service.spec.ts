import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Apod, ApodModel } from '../apod.schema';
import { ApodUpdateService } from '../apod.update.service';
import * as mongoose from 'mongoose';
import { sampleApodAttrs, apodResponseValidData } from './sampleObjects';
import { ConfigService } from '@nestjs/config';

export const mockApodModel = () => ({
  findOne: jest.fn(),
  create: jest.fn().mockReturnThis(),
  save: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn(),
});

describe('ApodUpdateService test', () => {
  let apodUpdateService: ApodUpdateService;
  let apodModel: ApodModel | any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ApodUpdateService,
        { provide: getModelToken(Apod.modelName), useFactory: mockApodModel },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    apodUpdateService = moduleRef.get('ApodUpdate' + 'Service');
    apodModel = moduleRef.get(Apod.modelName + 'Model');
  });

  describe('createApod test', () => {
    it('should create and save a pod given valid response data', async () => {
      apodModel.save.mockResolvedValue(sampleApodAttrs);
      const result = await apodUpdateService['createApod'](
        apodResponseValidData,
      );
      expect(result).toEqual(sampleApodAttrs);
      expect(apodModel.create).toHaveBeenCalled();
      expect(apodModel.save).toHaveBeenCalled();
      expect(apodModel.save).not.toThrow();
    });

    it('should throw an error given already existing apod', async () => {
      apodModel.save.mockImplementation(() => {
        throw new mongoose.Error('MongooseError');
      });
      await apodUpdateService['createApod'](apodResponseValidData);
      expect(apodModel.save).toThrow(mongoose.Error);
    });
  });

  describe('APOD update CRON JOB test', () => {
    it('succesfully updates APOD DB', async () => {
      jest
        .spyOn<any, string>(apodUpdateService, 'getApodData')
        .mockImplementation(() => apodResponseValidData);
      jest.spyOn<any, string>(apodUpdateService, 'createApod');
      await apodUpdateService['update']();
      expect(apodUpdateService['createApod']).toHaveBeenCalled();
      expect(apodModel.save).toHaveBeenCalled();
    });

    it('succesfully makes a request that returns error with code 400 - no new APODs', async () => {
      jest
        .spyOn<any, string>(apodUpdateService, 'getApodData')
        .mockImplementation(() => undefined);
      jest.spyOn<any, string>(apodUpdateService, 'createApod');
      await apodUpdateService['update']();
      expect(apodModel.save).not.toHaveBeenCalled();
      expect(apodUpdateService['createApod']).not.toHaveBeenCalled();
    });

    it('makes an unsuccesfull request', async () => {
      jest
        .spyOn<any, string>(apodUpdateService, 'getApodData')
        .mockImplementation(() => undefined);
      jest.spyOn<any, string>(apodUpdateService, 'createApod');
      await apodUpdateService['update']();
      expect(apodModel.save).not.toHaveBeenCalled();
      expect(apodUpdateService['createApod']).not.toHaveBeenCalled();
    });
  });
});

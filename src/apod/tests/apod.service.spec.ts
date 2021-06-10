import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Apod, ApodModel } from '../apod.schema';
import { ApodService } from '../apod.service';
import { sampleApodDoc, sampleDateDto } from './sampleObjects';

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

    it('no APOD found - return an empty array', async () => {
      apodModel.findOne.mockResolvedValue([]);
      const result = await apodService.getApod();
      expect(result).toEqual([]);
      expect(apodModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('getApodByDate test', () => {
    it('should get the APOD given valid date', async () => {
      apodModel.findOne.mockResolvedValue(sampleApodDoc);
      const result = await apodService.getApod(sampleDateDto);
      expect(result).toEqual(sampleApodDoc);
      expect(apodModel.findOne).toHaveBeenCalledTimes(1);
      expect(apodModel.findOne).toHaveBeenCalledWith(sampleDateDto);
    });

    it('no APOD with given date - should return an empty array', async () => {
      apodModel.findOne.mockResolvedValue([]);
      const result = await apodService.getApod(sampleDateDto);
      expect(result).toEqual([]);
      expect(apodModel.findOne).toHaveBeenCalledTimes(1);
      expect(apodModel.findOne).toHaveBeenCalledWith(sampleDateDto);
    });
  });
});

import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Apod, ApodAttrs, ApodModel } from '../apod.schema';
import { ApodService } from '../apod.service';
import { ApodDateDto } from '../dto/apodDate.dto';
import { ApodResponse } from '../types/apod-response.type';
import * as mongoose from 'mongoose';

const sampleApodDoc = {
  _id: '60b61ebee4670d210325437e',
  date: '2021-06-01',
  explanation:
    'What are those streaks across Orion? They are reflections of sunlight from numerous Earth-orbiting satellites. Appearing by eye as a series of successive points floating across a twilight sky, the increasing number of communications satellites, including SpaceX Starlink satellites, are causing concern among many astronomers. On the positive side, Starlink and similar constellations make the post-sunset sky more dynamic, satellite-based global communications faster, and help provide digital services to currently underserved rural areas.  On the negative side, though, these low Earth-orbit satellites make some deep astronomical imaging programs more difficult, in particular observing programs that need images taken just after sunset and just before dawn.  Planned future satellite arrays that function in higher orbits may impact investigations of the deep universe planned for large ground-based telescopes at any time during the night.  The streaks across Orion are not from Starlink but rather satellites in high geosynchronous orbit.  The featured picture, taken in 2019 December, is a digital combination of over 65 3-minutes exposures, with some images taken to highlight the background Orion Nebula, while others to feature the passing satellites.    SatCon2 Wokshop 12-16 July 2021: Mitigating Satellite Constellations',
  hdurl:
    'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_2138.jpg',
  title: 'Satellites over Orion',
  url: 'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_960.jpg',
};

const sampleApodAttrs: ApodAttrs = {
  date: '2021-06-01',
  explanation:
    'What are those streaks across Orion? They are reflections of sunlight from numerous Earth-orbiting satellites. Appearing by eye as a series of successive points floating across a twilight sky, the increasing number of communications satellites, including SpaceX Starlink satellites, are causing concern among many astronomers. On the positive side, Starlink and similar constellations make the post-sunset sky more dynamic, satellite-based global communications faster, and help provide digital services to currently underserved rural areas.  On the negative side, though, these low Earth-orbit satellites make some deep astronomical imaging programs more difficult, in particular observing programs that need images taken just after sunset and just before dawn.  Planned future satellite arrays that function in higher orbits may impact investigations of the deep universe planned for large ground-based telescopes at any time during the night.  The streaks across Orion are not from Starlink but rather satellites in high geosynchronous orbit.  The featured picture, taken in 2019 December, is a digital combination of over 65 3-minutes exposures, with some images taken to highlight the background Orion Nebula, while others to feature the passing satellites.    SatCon2 Wokshop 12-16 July 2021: Mitigating Satellite Constellations',
  hdurl:
    'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_2138.jpg',
  title: 'Satellites over Orion',
  url: 'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_960.jpg',
};

const sampleDateDto: ApodDateDto = {
  date: '2021-06-01',
};

const apodResponseValidData: ApodResponse = {
  date: '2021-06-01',
  explanation:
    'What are those streaks across Orion? They are reflections of sunlight from numerous Earth-orbiting satellites. Appearing by eye as a series of successive points floating across a twilight sky, the increasing number of communications satellites, including SpaceX Starlink satellites, are causing concern among many astronomers. On the positive side, Starlink and similar constellations make the post-sunset sky more dynamic, satellite-based global communications faster, and help provide digital services to currently underserved rural areas.  On the negative side, though, these low Earth-orbit satellites make some deep astronomical imaging programs more difficult, in particular observing programs that need images taken just after sunset and just before dawn.  Planned future satellite arrays that function in higher orbits may impact investigations of the deep universe planned for large ground-based telescopes at any time during the night.  The streaks across Orion are not from Starlink but rather satellites in high geosynchronous orbit.  The featured picture, taken in 2019 December, is a digital combination of over 65 3-minutes exposures, with some images taken to highlight the background Orion Nebula, while others to feature the passing satellites.    SatCon2 Wokshop 12-16 July 2021: Mitigating Satellite Constellations',
  hdurl:
    'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_2138.jpg',
  media_type: 'image',
  service_version: 'v1',
  title: 'Satellites over Orion',
  url: 'https://apod.nasa.gov/apod/image/2106/StarlinkOrion_Abolfath_960.jpg',
};

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
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.response.message).toBe(
          'Sorry the APOD for current date is not available',
        );
        expect(err.response.statusCode).toBe(400);
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
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.response.message).toBe('APOD for this date not found');
      expect(err.response.statusCode).toBe(400);
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

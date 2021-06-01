import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Apod, ApodModel } from '../apod.schema';
import { ApodService } from '../apod.service';
import { ApodDateDto } from '../dto/apodDate.dto';

const sampleApod = {
  _id: '60b61ebee4670d210325437e',
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

const sampleDateDto: ApodDateDto = {
  date: '2021-06-01',
};

const mockApodModel = () => ({
  findOne: jest.fn(),
});

describe('ApodService test', () => {
  let apodService: ApodService;
  let apodModel: ApodModel | any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ApodService,
        { provide: getModelToken(Apod.name), useFactory: mockApodModel },
      ],
    }).compile();

    apodService = moduleRef.get(ApodService);
    apodModel = moduleRef.get(getModelToken(Apod.name));
  });

  describe('getApod', () => {
    it('should get the latest APOD', async () => {
      apodModel.findOne.mockResolvedValue(sampleApod);
      const lastDates = apodService.getLastDates();
      const query = {
        $or: [{ date: lastDates.dateToday }, { date: lastDates.dateYesterday }],
      };
      const result = await apodService.getApod();
      expect(result).toEqual(sampleApod);
      expect(apodModel.findOne).toHaveBeenCalledTimes(1);
      expect(apodModel.findOne).toHaveBeenCalledWith(query);
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

  describe('getApodByDate', () => {
    it('should get the APOD by a given date', async () => {
      apodModel.findOne.mockResolvedValue(sampleApod);
      const result = await apodService.getApodByDate(sampleDateDto);
      expect(result).toEqual(sampleApod);
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
});

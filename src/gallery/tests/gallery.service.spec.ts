import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { GalleryService } from '../gallery.service';
import { Photo, PhotoModel } from '../photo.schema';
import * as mongoose from 'mongoose';
import {
  Camera,
  DateSort,
  GalleryQueryDto,
  Rover,
} from '../dto/galleryQueryDto.dto';

const sampleMarsPhotos = [
  {
    id: 840152,
    sol: 3133,
    camera: {
      id: 20,
      name: 'FHAZ',
      rover_id: 5,
      full_name: 'Front Hazard Avoidance Camera',
    },
    img_src:
      'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/03133/opgs/edr/fcam/FRB_675631940EDR_F0880366FHAZ00341M_.JPG',
    earth_date: '2021-05-30',
    rover: {
      id: 5,
      name: 'Curiosity',
      landing_date: '2012-08-06',
      launch_date: '2011-11-26',
      status: 'active',
    },
  },
  {
    id: 840153,
    sol: 3133,
    camera: {
      id: 20,
      name: 'FHAZ',
      rover_id: 5,
      full_name: 'Front Hazard Avoidance Camera',
    },
    img_src:
      'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/03133/opgs/edr/fcam/FLB_675631940EDR_F0880366FHAZ00341M_.JPG',
    earth_date: '2021-05-30',
    rover: {
      id: 5,
      name: 'Curiosity',
      landing_date: '2012-08-06',
      launch_date: '2011-11-26',
      status: 'active',
    },
  },
  {
    id: 840154,
    sol: 3133,
    camera: {
      id: 21,
      name: 'RHAZ',
      rover_id: 5,
      full_name: 'Rear Hazard Avoidance Camera',
    },
    img_src:
      'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/03133/opgs/edr/rcam/RRB_675631974EDR_F0880366RHAZ00341M_.JPG',
    earth_date: '2021-05-30',
    rover: {
      id: 5,
      name: 'Curiosity',
      landing_date: '2012-08-06',
      launch_date: '2011-11-26',
      status: 'active',
    },
  },
];

const mockPhotoModel = () => ({
  find: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn().mockReturnThis(),
  create: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  save: jest.fn(),
});

describe('GalleryService test', () => {
  let galleryService: GalleryService;
  let photoModel: PhotoModel | any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GalleryService,
        { provide: getModelToken(Photo.modelName), useFactory: mockPhotoModel },
      ],
    }).compile();

    galleryService = moduleRef.get<GalleryService>(GalleryService);
    photoModel = moduleRef.get(Photo.modelName + 'Model');
  });

  describe('getPhotos test', () => {
    it('should query the DB for max 10 photos given no query filters provided', async () => {
      jest.spyOn<any, string>(galleryService, 'buildQuery');
      const filter: GalleryQueryDto = {};
      await galleryService.getPhotos(filter);
      expect(photoModel.find).toHaveBeenCalled();
      expect(photoModel.limit).toHaveBeenCalled();
      expect(photoModel.exec).toHaveBeenCalled();
      expect(galleryService['buildQuery']).toHaveReturnedWith({});
    });

    it('should query the DB with camera filter only', async () => {
      jest.spyOn<any, string>(galleryService, 'buildFilterQuery');
      const filter: GalleryQueryDto = { camera: Camera.PANCAM };
      await galleryService.getPhotos(filter);
      expect(photoModel.find).toHaveBeenCalled();
      expect(photoModel.limit).toHaveBeenCalled();
      expect(photoModel.exec).toHaveBeenCalled();
      expect(galleryService['buildFilterQuery']).toReturnWith({
        camera: Camera.PANCAM,
      });
    });

    it('should query the DB with rover filter only', async () => {
      jest.spyOn<any, string>(galleryService, 'buildFilterQuery');
      const filter: GalleryQueryDto = { rover: Rover.Opportunity };
      await galleryService.getPhotos(filter);
      expect(photoModel.find).toHaveBeenCalled();
      expect(photoModel.limit).toHaveBeenCalled();
      expect(photoModel.exec).toHaveBeenCalled();
      expect(galleryService['buildFilterQuery']).toReturnWith({
        rover: Rover.Opportunity,
      });
    });

    it('should query the DB with sortByDate filter with asceding order', async () => {
      const filter: GalleryQueryDto = { sortByDate: DateSort.ASCENDING };
      await galleryService.getPhotos(filter);
      expect(photoModel.find).toHaveBeenCalled();
      expect(photoModel.limit).toHaveBeenCalled();
      expect(photoModel.exec).toHaveBeenCalled();
      expect(photoModel.sort).toHaveBeenCalledWith({
        date: DateSort.ASCENDING,
      });
    });

    it('should query the DB with sortByDate filter with asceding order', async () => {
      const filter: GalleryQueryDto = { sortByDate: DateSort.DESCENDING };
      await galleryService.getPhotos(filter);
      expect(photoModel.find).toHaveBeenCalled();
      expect(photoModel.limit).toHaveBeenCalled();
      expect(photoModel.exec).toHaveBeenCalled();
      expect(photoModel.sort).toHaveBeenCalledWith({
        date: DateSort.DESCENDING,
      });
    });

    it('should query the DB with all possible filters', async () => {
      jest.spyOn<any, string>(galleryService, 'buildFilterQuery');
      const filter: GalleryQueryDto = {
        sortByDate: DateSort.ASCENDING,
        rover: Rover.Curiosity,
        camera: Camera.FHAZ,
      };
      await galleryService.getPhotos(filter);
      expect(photoModel.find).toHaveBeenCalled();
      expect(photoModel.limit).toHaveBeenCalled();
      expect(photoModel.exec).toHaveBeenCalled();
      expect(photoModel.sort).toHaveBeenCalledWith({
        date: DateSort.ASCENDING,
      });
      expect(galleryService['buildFilterQuery']).toReturnWith({
        rover: Rover.Curiosity,
        camera: Camera.FHAZ,
      });
    });
  });

  describe('createPhotoTest', () => {
    it('creates and saves a photo given valid photoResponse data', async () => {
      await galleryService['createPhoto'](sampleMarsPhotos[0]);
      expect(photoModel.save).toHaveBeenCalled();
      expect(photoModel.save).not.toThrow();
    });

    it('throws an exception given invalid photoResponse data', async () => {
      photoModel.save.mockImplementation(() => {
        throw new mongoose.Error('MongooseError');
      });
      try {
        await galleryService['createPhoto'](sampleMarsPhotos[0]);
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error);
        expect(photoModel.save).toThrow(mongoose.Error);
      }
    });
  });

  describe('Gallery update CRON JOB test', () => {
    it('should create photos in a DB if requests returned an array of photos', async () => {
      jest
        .spyOn<any, string>(galleryService, 'performRequests')
        .mockImplementation(() => sampleMarsPhotos);
      jest.spyOn<any, string>(galleryService, 'createPhoto');
      await galleryService['update']();
      expect(galleryService['createPhoto']).toHaveBeenCalledTimes(
        sampleMarsPhotos.length,
      );
      expect(photoModel.save).toHaveBeenCalledTimes(sampleMarsPhotos.length);
    });

    it('should not create photos in a DB if requests returned an empty array', async () => {
      jest
        .spyOn<any, string>(galleryService, 'performRequests')
        .mockImplementation(() => []);
      jest.spyOn<any, string>(galleryService, 'createPhoto');
      await galleryService['update']();
      expect(galleryService['createPhoto']).not.toHaveBeenCalled();
      expect(photoModel.save).not.toHaveBeenCalled();
    });

    it('should not create photos in a DB if there were any errors while performing request', async () => {
      jest
        .spyOn<any, string>(galleryService, 'performRequests')
        .mockImplementation(() => []);
      jest.spyOn<any, string>(galleryService, 'createPhoto');
      await galleryService['update']();
      expect(galleryService['createPhoto']).not.toHaveBeenCalled();
      expect(photoModel.save).not.toHaveBeenCalled();
    });
  });
});

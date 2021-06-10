import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Photo, PhotoModel } from '../photo.schema';
import * as mongoose from 'mongoose';
import { sampleMarsPhotos } from './sampleObjects';
import { GalleryUpdateService } from '../gallery.update.service';
import { ConfigService } from '@nestjs/config';

const mockPhotoModel = () => ({
  find: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn().mockReturnThis(),
  create: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  save: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn(),
});

describe('galleryUpdateService test', () => {
  let galleryUpdateService: GalleryUpdateService;
  let photoModel: PhotoModel | any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GalleryUpdateService,
        { provide: getModelToken(Photo.modelName), useFactory: mockPhotoModel },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    galleryUpdateService =
      moduleRef.get<GalleryUpdateService>(GalleryUpdateService);
    photoModel = moduleRef.get(Photo.modelName + 'Model');
  });

  describe('createPhotoTest', () => {
    it('creates and saves a photo given valid photoResponse data', async () => {
      await galleryUpdateService['createPhoto'](sampleMarsPhotos[0]);
      expect(photoModel.save).toHaveBeenCalled();
      expect(photoModel.save).not.toThrow();
    });

    it('throws an exception given invalid photoResponse data', async () => {
      photoModel.save.mockImplementation(() => {
        throw new mongoose.Error('MongooseError');
      });
      try {
        await galleryUpdateService['createPhoto'](sampleMarsPhotos[0]);
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error);
        expect(photoModel.save).toThrow(mongoose.Error);
      }
    });
  });

  describe('Gallery update CRON JOB test', () => {
    it('should create photos in a DB if requests returned an array of photos', async () => {
      jest
        .spyOn<any, string>(galleryUpdateService, 'getPhotosData')
        .mockImplementation(() => [sampleMarsPhotos]);
      jest.spyOn<any, string>(galleryUpdateService, 'createPhoto');
      await galleryUpdateService['update']();
      expect(galleryUpdateService['createPhoto']).toHaveBeenCalledTimes(
        sampleMarsPhotos.length,
      );
      expect(photoModel.save).toHaveBeenCalledTimes(sampleMarsPhotos.length);
    });

    it('should not create photos in a DB if requests returned an empty array', async () => {
      jest
        .spyOn<any, string>(galleryUpdateService, 'getPhotosData')
        .mockImplementation(() => []);
      jest.spyOn<any, string>(galleryUpdateService, 'createPhoto');
      await galleryUpdateService['update']();
      expect(galleryUpdateService['createPhoto']).not.toHaveBeenCalled();
      expect(photoModel.save).not.toHaveBeenCalled();
    });

    it('should not create photos in a DB if there were any errors while performing request', async () => {
      jest
        .spyOn<any, string>(galleryUpdateService, 'getPhotosData')
        .mockImplementation(() => []);
      jest.spyOn<any, string>(galleryUpdateService, 'createPhoto');
      await galleryUpdateService['update']();
      expect(galleryUpdateService['createPhoto']).not.toHaveBeenCalled();
      expect(photoModel.save).not.toHaveBeenCalled();
    });
  });
});

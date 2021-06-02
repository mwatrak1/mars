import { Test } from '@nestjs/testing';
import { GalleryService } from '../gallery.service';
import { Photo, PhotoModel } from '../photo.schema';

const mockPhotoModel = () => ({
  find: jest.fn(),
});

describe('GalleryService test', () => {
  let galleryService: GalleryService;
  let galleryModel: PhotoModel | any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GalleryService,
        { provide: Photo.modelName, useFactory: mockPhotoModel },
      ],
    }).compile();

    galleryService = moduleRef.get<GalleryService>(GalleryService);
    galleryModel = moduleRef.get(Photo.modelName + 'Model');
  });

  describe('getPhotos test', () => {
    it('should getthe last available weather', async () => {
      galleryModel.find.mockResolvedValue({});
      const result = galleryService.getPhotos({});
      console.log(result);
      expect(galleryModel.find).toHaveBeenCalled();
    });
  });
});

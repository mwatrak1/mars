import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GalleryQueryDto } from './dto/galleryQueryDto.dto';
import { Photo, PhotoDoc } from './photo.schema';
@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Photo.modelName) private photoModel: Model<PhotoDoc>,
  ) {}

  getPhotos(galleryQueryDto: GalleryQueryDto): Promise<PhotoDoc[]> {
    const query: Record<string, unknown> =
      this.buildFilterQuery(galleryQueryDto);

    let result = this.photoModel.find(query).limit(10);

    if (galleryQueryDto.sortByDate) {
      result = result.sort({ date: galleryQueryDto.sortByDate });
    }

    return result.exec();
  }

  private buildFilterQuery(galleryQueryDto: GalleryQueryDto) {
    const { rover, camera } = galleryQueryDto;
    const query = {};

    if (rover) {
      query['rover'] = rover;
    }

    if (camera) {
      query['camera'] = camera;
    }

    return query;
  }
}

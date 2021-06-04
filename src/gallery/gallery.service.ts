import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { GalleryQueryDto, Rover } from './dto/galleryQueryDto.dto';
import { Photo, PhotoAttrs, PhotoDoc } from './photo.schema';
import axios, { AxiosResponse } from 'axios';
import { MarsPhoto, PhotosResponse } from './types/photos-response.type';
@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Photo.modelName) private photoModel: Model<PhotoDoc>,
  ) {}

  @Cron('0 0 12 * * *')
  private async update() {
    // dane z api sa opoznione o okolo 1 dzien do tylu
    const responses = await this.performRequests();
    for (const response of responses) {
      await this.createPhoto(response);
    }
  }

  getPhotos(galleryQueryDto: GalleryQueryDto) {
    const query: Record<string, unknown> = this.buildQuery(galleryQueryDto);

    let result = this.photoModel.find(query).limit(10);

    if (galleryQueryDto.sortByDate) {
      result = result.sort({ date: galleryQueryDto.sortByDate });
    }

    return result.exec();
  }

  private async createPhoto(photoResponse: MarsPhoto) {
    const date = new Date(photoResponse.earth_date);
    const newPhoto: PhotoAttrs = {
      date,
      url: photoResponse.img_src,
      rover: photoResponse.rover.name,
      camera: photoResponse.camera.name,
    };
    try {
      (await this.photoModel.create(newPhoto)).save();
    } catch (error) {
      console.error(error);
    }
  }

  private async performRequests(): Promise<MarsPhoto[]> {
    const dateYesterday = this.getDateYesterday().toISOString().slice(0, 10);
    const photos: MarsPhoto[] = [];
    const rovers = Object.values(Rover);

    for (const rover of rovers) {
      for (let i = 1; i < 4; i++) {
        // eslint-disable-next-line prettier/prettier
        const nasaPhotosUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${dateYesterday}&api_key=${process.env.NASA_API_KEY}&page=${i.toString()}`;
        const response: PhotosResponse = await this.getRoversPhotos(
          nasaPhotosUrl,
        );
        if (response.photos.length !== 0) {
          response.photos.map((photo: MarsPhoto) => photos.push(photo));
        }
      }
    }
    return photos;
  }

  private async getRoversPhotos(url: string) {
    const response = await axios.get(url).catch((error) => {
      console.log('Error while getting photos for URL:', url);
      console.error(error);
      return [];
    });
    return (response as AxiosResponse<PhotosResponse>).data;
  }

  private buildQuery(galleryQueryDto: GalleryQueryDto) {
    if (Object.keys(galleryQueryDto).length === 0) {
      return {};
    } else {
      return this.buildFilterQuery(galleryQueryDto);
    }
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

  private getDateYesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Rover } from './dto/galleryQueryDto.dto';
import { Photo, PhotoAttrs, PhotoDoc } from './photo.schema';
import axios, { AxiosResponse } from 'axios';
import { MarsPhoto, PhotosResponse } from './types/photos-response.type';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config.interface';

@Injectable()
export class GalleryUpdateService {
  private readonly NASA_API_KEY: string;
  constructor(
    @InjectModel(Photo.modelName) private photoModel: Model<PhotoDoc>,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    this.NASA_API_KEY = this.configService.get('NASA_API_KEY');
  }

  @Cron('0 0 12 * * *')
  private async update() {
    const responses = await this.getPhotosData();
    const createdPhotoPromises = [];
    responses.forEach((response) => {
      createdPhotoPromises.push(
        response.map((photo) => this.createPhoto(photo)),
      );
    });
    await Promise.all(createdPhotoPromises);
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
      Logger.error(error);
    }
  }

  private async getPhotosData(): Promise<MarsPhoto[][]> {
    const urls = this.getPhotoUrls();
    const promisedPhotos = urls.map((url) =>
      this.getRoversPhotos(url).then((response) => response.photos),
    );
    return await Promise.all(promisedPhotos);
  }

  private async getRoversPhotos(url: string): Promise<PhotosResponse> {
    let response: AxiosResponse<PhotosResponse>;
    try {
      response = await axios.get(url);
    } catch (error) {
      Logger.log('Error while getting photos for URL:', url);
      Logger.error(error);
      return { photos: [] };
    }
    return response.data;
  }

  private getPhotoUrls(): string[] {
    const dateYesterday = this.getDateYesterday();
    const rovers = Object.values(Rover);
    const urls = [];

    for (const rover of rovers) {
      for (let i = 1; i < 4; i++) {
        // eslint-disable-next-line prettier/prettier
        const nasaPhotosUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${dateYesterday}&api_key=${this.NASA_API_KEY}&page=${i.toString()}`;
        urls.push(nasaPhotosUrl);
      }
    }
    return urls;
  }

  private getDateYesterday(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().slice(0, 10);
  }
}

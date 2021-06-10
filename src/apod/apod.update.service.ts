import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { EnvironmentVariables } from '../config.interface';
import { Apod, ApodAttrs, ApodDoc } from './apod.schema';
import { ApodResponse } from './types/apod-response.type';

@Injectable()
export class ApodUpdateService {
  private readonly NASA_API_KEY: string;
  constructor(
    @InjectModel(Apod.modelName) private apodModel: Model<ApodDoc>,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    this.NASA_API_KEY = this.configService.get('NASA_API_KEY');
  }

  @Cron('0 0 12 * * *')
  private async update() {
    const response = await this.getApodData();
    if (response === undefined) {
      return undefined;
    }
    await this.createApod(response);
  }

  private async createApod(response: ApodResponse): Promise<ApodAttrs> {
    const { date, title, explanation, url, hdurl } = response;
    const newApod: ApodAttrs = {
      date,
      title,
      explanation,
      url,
      hdurl,
    };
    try {
      (await this.apodModel.create(newApod)).save();
    } catch (error) {
      Logger.error('Error while creating new APOD');
      Logger.error(error);
    }
    return newApod;
  }

  private async getApodData(): Promise<ApodResponse> {
    const dateToday = new Date().toISOString().slice(0, 10);
    const nasaApodUrl = `https://api.nasa.gov/planetary/apod?api_key=${this.NASA_API_KEY}&date=${dateToday}`;
    let response: AxiosResponse;
    try {
      response = await axios.get(nasaApodUrl);
    } catch (error) {
      Logger.log('Error while getting new APOD');
      Logger.error(error);
      return undefined;
    }
    if (response.data.code === 400) return undefined;
    return response.data;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Apod, ApodAttrs, ApodDoc } from './apod.schema';
import { ApodDateDto } from './dto/apodDate.dto';
import axios from 'axios';
import { ApodResponse } from './types/apod-response.type';

@Injectable()
export class ApodService {
  constructor(
    @InjectModel(Apod.modelName) private apodModel: Model<ApodDoc>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  // wszystkie zapytania do bazy objac try catch

  @Cron('0 0 12 * * *')
  private async update() {
    const response = await this.performRequest();
    if (!response) {
      return this.scheduleJob();
    }
    await this.createApod(response);
  }

  async getApod(): Promise<ApodDoc> {
    const { dateToday, dateYesterday } = this.getLastDates();
    const query = {
      $or: [{ date: dateToday }, { date: dateYesterday }],
    };

    const apod = await this.apodModel.findOne(query);

    if (!apod) {
      throw new BadRequestException(
        'Sorry the APOD for current date is not available',
      );
    }
    return apod;
  }

  async getApodByDate(apodDateDto: ApodDateDto): Promise<ApodDoc> {
    const apod = await this.apodModel.findOne(apodDateDto);
    if (!apod) {
      throw new BadRequestException('APOD for this date not found');
    }
    return apod;
  }

  private async performRequest() {
    const { dateToday } = this.getLastDates();
    const nasaApodUrl = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&date=${dateToday}`;
    const response = await axios.get(nasaApodUrl);
    return response.data;
  }

  private async createApod(response: ApodResponse) {
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
      console.error(error);
    }
  }

  private scheduleJob() {
    return '';
  }

  // TODO: test
  getLastDates() {
    const date = new Date();
    const dateToday = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() - 1);
    const dateYesterday = date.toISOString().slice(0, 10);
    return { dateToday, dateYesterday };
  }
}

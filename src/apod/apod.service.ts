import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Apod, ApodDoc } from './apod.schema';
import { ApodDateDto } from './dto/apodDate.dto';
@Injectable()
export class ApodService {
  constructor(@InjectModel(Apod.name) private apodModel: Model<ApodDoc>) {}

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

  // TODO: test
  getLastDates() {
    const date = new Date();
    const dateToday = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() - 1);
    const dateYesterday = date.toISOString().slice(0, 10);
    return { dateToday, dateYesterday };
  }
}

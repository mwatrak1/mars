import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Apod, ApodDoc } from './apod.schema';
import { ApodDateDto } from './dto/apodDate.dto';

@Injectable()
export class ApodService {
  constructor(@InjectModel(Apod.modelName) private apodModel: Model<ApodDoc>) {}

  async getApod(apodDateDto?: ApodDateDto): Promise<ApodDoc> {
    let date: string;
    date = apodDateDto?.date
      ? (date = apodDateDto.date)
      : (date = new Date().toISOString().slice(0, 10));
    return await this.apodModel.findOne({ date });
  }
}

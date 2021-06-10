import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApodDoc } from './apod.schema';
import { ApodService } from './apod.service';
import { ApodDateDto } from './dto/apodDate.dto';

@Controller('apod')
export class ApodController {
  constructor(private apodService: ApodService) {}

  @Get()
  async getApod(): Promise<ApodDoc> {
    const apod = await this.apodService.getApod();
    if (!apod) {
      throw new NotFoundException(
        'Sorry the APOD for current date is not available',
      );
    }
    return apod;
  }

  @Get(':date')
  async getApodByDate(@Param() apodDateDto: ApodDateDto): Promise<ApodDoc> {
    const apod = await this.apodService.getApod(apodDateDto);
    if (!apod) {
      throw new NotFoundException(
        'Sorry the APOD for given date is not available',
      );
    }
    return apod;
  }
}

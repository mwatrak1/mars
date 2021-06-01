import { Controller, Get, Param } from '@nestjs/common';
import { ApodService } from './apod.service';
import { ApodDateDto } from './dto/apodDate.dto';

@Controller('apod')
export class ApodController {
  constructor(private apodService: ApodService) {}

  @Get()
  getApod() {
    return this.apodService.getApod();
  }

  @Get(':date')
  getApodByDate(@Param() apodDateDto: ApodDateDto) {
    return this.apodService.getApodByDate(apodDateDto);
  }
}

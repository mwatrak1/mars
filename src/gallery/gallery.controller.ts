import { Controller, Get, Query } from '@nestjs/common';
import { GalleryQueryDto } from './dto/galleryQueryDto.dto';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Get()
  getphotos(@Query() galleryQueryDto: GalleryQueryDto) {
    return this.galleryService.getPhotos(galleryQueryDto);
  }
}

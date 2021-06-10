import { Controller, Get, Query } from '@nestjs/common';
import { GalleryQueryDto } from './dto/galleryQueryDto.dto';
import { GalleryService } from './gallery.service';
import { PhotoDoc } from './photo.schema';

@Controller('gallery')
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Get()
  getphotos(@Query() galleryQueryDto: GalleryQueryDto): Promise<PhotoDoc[]> {
    return this.galleryService.getPhotos(galleryQueryDto);
  }
}

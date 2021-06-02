import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { Photo, photoSchema } from './photo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Photo.modelName, schema: photoSchema }]),
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}

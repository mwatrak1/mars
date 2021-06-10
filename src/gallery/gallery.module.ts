import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { Photo, photoSchema } from './photo.schema';
import { GalleryUpdateService } from './gallery.update.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Photo.modelName, schema: photoSchema }]),
    ConfigModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService, GalleryUpdateService],
})
export class GalleryModule {}

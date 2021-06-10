import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { ApodModule } from './apod/apod.module';
import { GalleryModule } from './gallery/gallery.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EnvironmentVariables } from './config.interface';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    WeatherModule,
    ApodModule,
    GalleryModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        uri:
          process.env.NODE_ENV === 'test'
            ? configService.get('TEST_DB_HOST')
            : configService.get('DB_HOST'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

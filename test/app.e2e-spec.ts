import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Apod, ApodAttrs, ApodModel } from './../src/apod/apod.schema';
import {
  Weather,
  WeatherAttrs,
  WeatherModel,
} from './../src/weather/weather.schema';
import {
  Photo,
  PhotoAttrs,
  PhotoModel,
  PhotoDoc,
} from './../src/gallery/photo.schema';
import { Camera, Rover } from './../src/gallery/dto/galleryQueryDto.dto';
import { getModelToken } from '@nestjs/mongoose';

let apodDB: ApodModel;
let galleryDB: PhotoModel;
let weatherDB: WeatherModel;

const createApod = async (date: Date) => {
  const attrs: ApodAttrs = {
    date: date.toISOString().slice(0, 10),
    title: 'Sample Apod ' + Math.random().toString(36).substring(2),
    explanation:
      'Sample Explanation ' + Math.random().toString(36).substring(2),
    url: 'https://url/' + Math.random().toString(36).substring(2),
    hdurl: 'https://hdurl//' + Math.random().toString(36).substring(2),
  };
  const apod = await apodDB.create(attrs);
  return apod;
};

const createPhoto = async (date: Date, camera: Camera, rover: Rover) => {
  const attrs: PhotoAttrs = {
    date,
    url: 'https://url/' + Math.random().toString(36).substring(2),
    rover,
    camera,
  };
  const photo = await galleryDB.create(attrs);
  return photo;
};

const createWeather = async (date: Date) => {
  const attrs: WeatherAttrs = {
    date,
    sol: 'Sample Sol ' + Math.random().toString(36).substring(2),
    ls: 'Sample Ls ' + Math.random().toString(36).substring(2),
    season: 'Sample Season ' + Math.random().toString(36).substring(2),
    min_temp: Math.random() * 10,
    max_temp: Math.random() * 10,
    pressure: Math.random() * 100,
    sunrise: 'Sample sunrise ' + Math.random().toString(36).substring(2),
    sunset: 'Sample sunset ' + Math.random().toString(36).substring(2),
  };
  const weather = await weatherDB.create(attrs);
  return weather;
};

describe('E2E tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    apodDB = moduleFixture.get(getModelToken(Apod.modelName));
    galleryDB = moduleFixture.get(getModelToken(Photo.modelName));
    weatherDB = moduleFixture.get(getModelToken(Weather.modelName));
    await app.init();
  });

  describe('APOD Module', () => {
    afterEach(async () => {
      await apodDB.collection.deleteMany({});
    });

    it('/apod/ - gets APOD for today (GET)', async () => {
      const date = new Date();
      const newApod = await createApod(date);
      const response = await request(app.getHttpServer())
        .get('/apod')
        .expect(200);
      expect(response.body.date).toEqual(newApod.date);
      expect(response.body._id).toEqual(newApod.id);
    });

    it('/apod/ - throws NotFoundException - no APOD found (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/apod')
        .expect(404);
      expect(response.body.message).toEqual(
        'Sorry the APOD for current date is not available',
      );
      expect(response.body.error).toEqual('Not Found');
    });

    it('/apod/{date} - gets APOD with given date (GET)', async () => {
      const date = new Date();
      const newApod = await createApod(date);
      const response = await request(app.getHttpServer())
        .get('/apod/' + date.toISOString().slice(0, 10))
        .expect(200);
      expect(response.body._id).toEqual(newApod.id);
      expect(response.body.date).toEqual(date.toISOString().slice(0, 10));
    });

    it('/apod/{date} - throws not found exception - no APOD with given date found (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/apod/' + 'dfkw02fk20')
        .expect(404);
      expect(response.body.message).toEqual('APOD for this date not found');
      expect(response.body.error).toEqual('Not Found');
    });
  });

  describe('Gallery Module', () => {
    afterEach(async () => {
      await galleryDB.collection.deleteMany({});
    });
    it('/gallery/ with rover filter applied (GET)', async () => {
      const date = new Date();
      await createPhoto(date, Camera.FHAZ, Rover.Curiosity);
      await createPhoto(date, Camera.RHAZ, Rover.Curiosity);
      await createPhoto(date, Camera.MARDI, Rover.Opportunity);
      await createPhoto(date, Camera.MARDI, Rover.Spirit);
      const response = await request(app.getHttpServer())
        .get('/gallery?rover=Curiosity')
        .expect(200);

      response.body.forEach((photo: PhotoDoc) => {
        expect(photo.rover).toEqual(Rover.Curiosity);
      });
      expect(response.body).toHaveLength(2);
    });

    it('/gallery/ with camera filter applied (GET)', async () => {
      const date = new Date();
      await createPhoto(date, Camera.FHAZ, Rover.Curiosity);
      await createPhoto(date, Camera.FHAZ, Rover.Curiosity);
      await createPhoto(date, Camera.MARDI, Rover.Opportunity);
      await createPhoto(date, Camera.MAST, Rover.Spirit);
      const response = await request(app.getHttpServer())
        .get('/gallery?camera=FHAZ')
        .expect(200);

      response.body.forEach((photo: PhotoDoc) => {
        expect(photo.camera).toEqual(Camera.FHAZ);
      });
      expect(response.body).toHaveLength(2);
    });

    it('/gallery/ with sortByDate ascending filter applied (GET)', async () => {
      const date = new Date();
      await createPhoto(date, Camera.MAHLI, Rover.Spirit);
      date.setDate(date.getDate() - 1);
      await createPhoto(date, Camera.FHAZ, Rover.Curiosity);
      date.setDate(date.getDate() - 1);
      await createPhoto(date, Camera.MINITES, Rover.Opportunity);
      const response = await request(app.getHttpServer())
        .get('/gallery?sortByDate=-1')
        .expect(200);
      expect(response.body).toHaveLength(3);

      for (let i = 0; i < 2; i++) {
        expect(new Date(response.body[i].date).getDay()).toBeGreaterThan(
          new Date(response.body[i + 1].date).getDay(),
        );
      }
    });

    it('/gallery/ with sortByDate descending filter applied (GET)', async () => {
      const date = new Date();
      await createPhoto(date, Camera.MAHLI, Rover.Spirit);
      date.setDate(date.getDate() - 1);
      await createPhoto(date, Camera.FHAZ, Rover.Curiosity);
      date.setDate(date.getDate() - 1);
      await createPhoto(date, Camera.MINITES, Rover.Opportunity);
      const response = await request(app.getHttpServer())
        .get('/gallery?sortByDate=1')
        .expect(200);
      expect(response.body).toHaveLength(3);

      for (let i = 0; i < 2; i++) {
        expect(new Date(response.body[i].date).getDay()).toBeLessThan(
          new Date(response.body[i + 1].date).getDay(),
        );
      }
    });
  });

  describe('Weather module', () => {
    afterEach(async () => {
      await weatherDB.collection.deleteMany({});
    });
    it('/weather/ - gets the available weather', async () => {
      const date = new Date();
      const newWeather = await createWeather(date);
      const response = await request(app.getHttpServer())
        .get('/weather')
        .expect(200);

      expect(response.body.date).toEqual(newWeather.date.toISOString());
      expect(response.body._id).toEqual(newWeather.id);
    });

    it('/weather/ - throws NotFoundWrror - no weather available', async () => {
      const response = await request(app.getHttpServer())
        .get('/weather')
        .expect(404);
      expect(response.body.message).toEqual('Sorry weather is not available');
    });
  });
});

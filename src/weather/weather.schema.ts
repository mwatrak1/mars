import * as mongoose from 'mongoose';

interface WeatherAttrs {
  date: Date;
  sol: string;
  ls: string;
  season: string;
  min_temp: number;
  max_temp: number;
  pressure: number;
  sunrise: string;
  sunset: string;
}

interface WeatherDoc extends mongoose.Document {
  date: Date;
  sol: string;
  ls: string;
  season: string;
  min_temp: number;
  max_temp: number;
  pressure: number;
  sunrise: string;
  sunset: string;
}

interface WeatherModel extends mongoose.Model<WeatherDoc> {
  build(attrs: WeatherAttrs): WeatherDoc;
}

const weatherSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    sol: {
      type: String,
      required: true,
    },
    ls: {
      type: String,
      required: true,
    },
    season: {
      type: String,
      required: true,
    },
    min_temp: {
      type: Number,
      required: true,
    },
    max_temp: {
      type: Number,
      required: true,
    },
    pressure: {
      type: Number,
      required: true,
    },
    sunrise: {
      type: String,
      required: true,
    },
    sunset: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

const Weather = mongoose.model<WeatherDoc, WeatherModel>(
  'Weather',
  weatherSchema,
);

export { Weather, WeatherAttrs, WeatherDoc, WeatherModel, weatherSchema };

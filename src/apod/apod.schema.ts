import * as mongoose from 'mongoose';

interface ApodAttrs {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
}

interface ApodDoc extends mongoose.Document {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
}

interface ApodModel extends mongoose.Model<ApodDoc> {
  build(attrs: ApodAttrs): ApodDoc;
}

const apodSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    hdurl: {
      type: String,
      required: true,
    },
  },
  { collection: 'apod' },
);

const Apod = mongoose.model<ApodDoc, ApodModel>('Apod', apodSchema);

export { Apod, ApodDoc, ApodModel, apodSchema };

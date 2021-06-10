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
      unique: true,
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

const Apod = mongoose.model<ApodDoc, ApodModel>('Apod', apodSchema);

export { Apod, ApodAttrs, ApodDoc, ApodModel, apodSchema };

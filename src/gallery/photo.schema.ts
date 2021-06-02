import * as mongoose from 'mongoose';

interface PhotoAttrs {
  date: Date;
  url: string;
  rover: string;
  camera: string;
}

interface PhotoDoc extends mongoose.Document {
  date: Date;
  url: string;
  rover: string;
  camera: string;
}

interface PhotoModel extends mongoose.Model<PhotoDoc> {
  build(attrs: PhotoAttrs): PhotoDoc;
}

const photoSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  rover: {
    type: String,
    required: true,
  },
  camera: {
    type: String,
    required: true,
  },
});

const Photo = mongoose.model<PhotoDoc, PhotoModel>('Photo', photoSchema);

export { Photo, PhotoAttrs, PhotoDoc, PhotoModel, photoSchema };

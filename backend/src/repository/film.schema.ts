import { Schema, Document, Model, model, models } from 'mongoose';
import { FilmEntity, ScheduleEntity } from './films-repository.interface';

export type FilmDocument = FilmEntity & Document;

const ScheduleSchema = new Schema<ScheduleEntity>(
  {
    id: { type: String, required: true },
    daytime: { type: String, required: true },
    hall: { type: Number, required: true },
    rows: { type: Number, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    taken: { type: [String], default: [] },
  },
  { _id: false },
);

export const FilmSchema = new Schema<FilmDocument>(
  {
    id: { type: String, required: true, unique: true },
    rating: { type: Number, required: true },
    director: { type: String, required: true },
    tags: { type: [String], default: [] },
    image: { type: String, required: true },
    cover: { type: String, required: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    description: { type: String, required: true },
    schedule: { type: [ScheduleSchema], default: [] },
  },
  {
    collection: 'films',
    versionKey: false,
  },
);

export function getFilmModel(): Model<FilmDocument> {
  return (
    (models.Film as Model<FilmDocument>) ||
    model<FilmDocument>('Film', FilmSchema)
  );
}

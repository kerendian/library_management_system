import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const bookSchema = new Schema({
    title: { type: String, required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'Author', index: true },
    topic: { type: String, index: true },
    year: { type: Number, index: true },
    availability: { type: Boolean, default: true }
});

const Book = model('Book', bookSchema);

export default Book;

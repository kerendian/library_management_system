import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const authorSchema = new Schema({
    name: { type: String, required: true },
    biography: String,
});

const Author = model('Author', authorSchema);

export default Author;

import mongoose, { Document, Schema } from 'mongoose';

export interface blog extends Document {
  picture: string;
  title: string;
  date: string;
  description: string;
}

const blogschema = new Schema({
    picture: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true }
});

export default mongoose.model<blog>('Blog', blogschema);

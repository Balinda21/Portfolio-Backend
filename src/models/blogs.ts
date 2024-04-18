import mongoose, { Document, Schema } from 'mongoose';

export interface blog extends Document {
  picture: string;
  title: string;
  date: string;
  description: string;
  likes: number; // New field for storing likes
}

const blogschema = new Schema({
    picture: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 }
});

export default mongoose.model<blog>('Blog', blogschema);

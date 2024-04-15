import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the Comment interface
export interface Comment extends Document {
  text: string;
  name: string;
}

// Define the schema for the Comment model
const commentSchema = new Schema<Comment>({
 // Assuming postId references a Post model
  text: { type: String, required: true },
  name: { type: String, required: true },
});

// Create the Comment model
const CommentModel: Model<Comment> = mongoose.model<Comment>('Comment', commentSchema);

export default CommentModel;

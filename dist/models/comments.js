import mongoose, { Schema } from 'mongoose';
// Define the schema for the Comment model
const commentSchema = new Schema({
    // Assuming postId references a Post model
    text: { type: String, required: true },
    name: { type: String, required: true },
});
// Create the Comment model
const CommentModel = mongoose.model('Comment', commentSchema);
export default CommentModel;
//# sourceMappingURL=comments.js.map
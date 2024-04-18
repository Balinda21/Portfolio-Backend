import mongoose, { Schema } from 'mongoose';
const blogschema = new Schema({
    picture: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 }
});
export default mongoose.model('Blog', blogschema);
//# sourceMappingURL=blogs.js.map
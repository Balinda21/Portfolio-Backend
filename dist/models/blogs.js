import mongoose, { Schema } from 'mongoose';
const blogschema = new Schema({
    picture: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true }
});
export default mongoose.model('Blog', blogschema);
//# sourceMappingURL=blogs.js.map
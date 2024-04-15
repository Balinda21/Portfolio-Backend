import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // Default value is false
});
const UserModel = mongoose.model('User', userSchema);
export default UserModel;
//# sourceMappingURL=Users.js.map
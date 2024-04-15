import mongoose, { Schema } from 'mongoose';
// Define the schema for the Contact model
const contactSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true }
});
// Create the Contact model
const ContactModel = mongoose.model('Contact', contactSchema);
export default ContactModel;
//# sourceMappingURL=contact.js.map
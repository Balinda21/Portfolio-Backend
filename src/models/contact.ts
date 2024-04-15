import mongoose, { Document, Schema, Model } from 'mongoose';

// Declare the Contact interface
export interface Contact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Define the schema for the Contact model
const contactSchema = new Schema<Contact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true }
});

// Create the Contact model
const ContactModel: Model<Contact> = mongoose.model<Contact>('Contact', contactSchema);

export default ContactModel;

import mongoose from 'mongoose';
import { collections } from '../shared/collections.js';

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  src: { type: String, required: true },
  category: { type: String, required: true, index: true },
  source: { type: String, required: true }
}, { versionKey: false });

const enquirySchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  name: { type: String, required: true, maxlength: 100 },
  business: { type: String, maxlength: 100, default: '' },
  email: { type: String, required: true, maxlength: 150, lowercase: true },
  phone: { type: String, maxlength: 30, default: '' },
  selectedCollection: { type: String, required: true, enum: [...collections.map(c => c.title), 'A little of everything'] },
  quantity: { type: Number, min: 1, max: 100000000, default: null },
  details: { type: String, maxlength: 3000, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' }
}, { timestamps: true, versionKey: false });

export const Product = mongoose.model('Product', productSchema);
export const Enquiry = mongoose.model('Enquiry', enquirySchema);

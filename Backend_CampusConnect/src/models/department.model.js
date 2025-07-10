import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  faculty: [String], // teachers ke naam (optional)
  description: String,
}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);

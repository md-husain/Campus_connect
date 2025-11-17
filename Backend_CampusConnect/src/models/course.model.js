import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  faculty: String,
  description: String,
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);

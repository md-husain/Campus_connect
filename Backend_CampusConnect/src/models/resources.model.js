import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);

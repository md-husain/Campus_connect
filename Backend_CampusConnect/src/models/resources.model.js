import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Temporarily remove course reference until Course model is properly registered
  // course: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Course'
  // }
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);

import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{
    text: String,
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expiresAt: Date
}, { timestamps: true });

export default mongoose.model('Poll', pollSchema);

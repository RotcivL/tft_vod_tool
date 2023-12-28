import mongoose from 'mongoose';

const vodSchema = new mongoose.Schema({
  vodId: { type: String, required: true },
  startTime: { type: Date, required: true },
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
  ],
  avg: { type: String, required: true },
});

const Vod = mongoose.models.Vod || mongoose.model('Vod', vodSchema);

export default Vod;


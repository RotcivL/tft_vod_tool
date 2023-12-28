import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  vodTime: { type: Number, required: true },
  placement: { type: Number, required: true },
  augments: [{ type: String, required: true }],
  units: [
    {
      itemNames: [{ type: String }],
      character_id: { type: String },
      tier: { type: Number },
    },
  ],
  traits: [
    {
      name: { type: String },
      tier_current: { type: Number },
    },
  ],
});

const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);

export default Match;


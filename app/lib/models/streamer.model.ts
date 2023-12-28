import { Region } from '@/app/constants/regions';
import mongoose from 'mongoose';

const streamerSchema = new mongoose.Schema({
  twitchName: { type: String, required: true },
  summonerName: { type: String, required: true },
  region: { type: String, enum: Region, required: true },
  twitchId: { type: String, required: true, unique: true },
  puuid: { type: String, required: true },
  profilePicture: { type: String, required: true },
  lastUpdate: { type: Date, default: Date.now },
  vods: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vod',
    },
  ],
});

const Streamer =
  mongoose.models.Streamer || mongoose.model('Streamer', streamerSchema);

export default Streamer;


'use client';
import { useRef } from 'react';
import { TwitchPlayer, TwitchPlayerInstance } from 'react-twitch-embed';
import MatchTable from './matchTable';
import { VodType } from '@/app/lib/types';

export default function VodPlayer({ vod }: { vod: VodType }) {
  const embed = useRef<TwitchPlayerInstance>();
  const handleReady = (e: TwitchPlayerInstance) => {
    embed.current = e;
  };

  const seek = (timestamp: number) => {
    if (!embed.current) {
      return;
    }
    embed.current.seek(timestamp);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <TwitchPlayer video={vod.vodId} onReady={handleReady} />
      </div>
      <div>
        <MatchTable matches={vod.matches} setTime={seek} />
      </div>
    </div>
  );
}


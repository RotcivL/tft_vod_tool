'use client';

import Image from 'next/image';
import { Home } from '@/app/ui/streamers/buttons';
import Button from '@/app/ui/button';
import { updateStreamer } from '@/app/lib/actions/streamer.actions';

export default function ({
  id,
  twitchName,
  summonerName,
  region,
  profilePicture,
  lastUpdated,
}: {
  id: string;
  twitchName: string;
  summonerName: string;
  region: string;
  profilePicture: string;
  lastUpdated: Date;
}) {
  return (
    <div className="flex w-full flex-col justify-center gap-2">
      <div className=" flex w-48 items-center gap-2">
        <Home />
        <Button onClick={() => updateStreamer(id)} type="button">
          Update
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={profilePicture}
              className="rounded-full"
              width={84}
              height={84}
              alt={`${twitchName}'s profile picture`}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-dark-2">
              {twitchName}
            </h2>
            <p className="text-base-medium text-dark-4">
              Summoner: {summonerName}
            </p>
            <p className="text-base-medium text-dark-4">Region: {region}</p>
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-lg text-base-regular text-dark-3">
        {lastUpdated.toUTCString()}
      </p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
}


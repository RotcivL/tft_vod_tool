import { fetchStreamer } from '@/app/lib/actions/streamer.actions';
import { notFound } from 'next/navigation';

import ProfileHeader from '@/app/ui/streamers/profileHeader';

import VodTable from '@/app/ui/vods/vodTable';

export default async function Page({
  params,
}: {
  params: { streamerId: string };
}) {
  const id = params.streamerId;

  const streamer = await fetchStreamer(id);

  if (!streamer) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <div className="flex ">
        <ProfileHeader
          id={id}
          twitchName={streamer.twitchName}
          summonerName={streamer.summonerName}
          region={streamer.region}
          profilePicture={streamer.profilePicture}
          lastUpdated={streamer.lastUpdate}
        />
      </div>
      <div>
        <VodTable streamer={id} vods={streamer.vods} />
      </div>
    </div>
  );
}


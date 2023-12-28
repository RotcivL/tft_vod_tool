import { fetchStreamer } from '@/app/lib/actions/streamer.actions';
import { StreamerType } from '@/app/lib/types';
import { Home, ViewStreamer } from '@/app/ui/streamers/buttons';
import VodPlayer from '@/app/ui/vods/vod';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: { streamerId: string; vodId: string };
}) {
  console.log(params);
  const streamer: StreamerType = await fetchStreamer(params.streamerId);
  const vod = streamer.vods.find(vod => vod.vodId === params.vodId);
  if (!vod) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <Home />
        <ViewStreamer id={params.streamerId} text="Back" />
      </div>
      <VodPlayer vod={vod} />
    </div>
  );
}


import { fetchVod } from '@/app/lib/actions/streamer.actions';
import { VodType } from '@/app/lib/types';
import { Home, ViewStreamer } from '@/app/ui/streamers/buttons';
import VodPlayer from '@/app/ui/vods/vod';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: { streamerId: string; vodId: string };
}) {
  const vod: VodType = await fetchVod(params.vodId);

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


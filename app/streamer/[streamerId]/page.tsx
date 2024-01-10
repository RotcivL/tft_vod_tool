import {
  fetchStreamerFilteredVods,
  fetchVodPages,
} from '@/app/lib/actions/streamer.actions';
import { notFound } from 'next/navigation';

import ProfileHeader from '@/app/ui/streamers/profileHeader';

import VodTable from '@/app/ui/vods/vodTable';
import { Suspense } from 'react';
import { VodTableSkeleton } from '@/app/ui/skeletons';
import Pagination from '@/app/ui/pagination';

export default async function Page({
  params,
  searchParams,
}: {
  params: { streamerId: string };
  searchParams?: {
    page?: string;
  };
}) {
  const id = params.streamerId;
  const currentPage = Number(searchParams?.page) || 1;
  const streamer = await fetchStreamerFilteredVods(id, currentPage);

  if (!streamer) {
    notFound();
  }

  const totalPages = await fetchVodPages(id);

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
      <Suspense key={currentPage} fallback={<VodTableSkeleton />}>
        <VodTable streamer={id} vods={streamer.vods} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}


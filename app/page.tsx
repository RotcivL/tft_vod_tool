import Search from '@/app/ui/search';
import { AddStreamer } from '@/app/ui/streamers/buttons';
import Pagination from '@/app/ui/pagination';
import { Suspense } from 'react';
import { StreamerTableSkeleton } from '@/app/ui/skeletons';
import Table from '@/app/ui/streamers/table';
import { fetchStreamerPages } from './lib/actions/streamer.actions';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchStreamerPages(query);

  return (
    <div>
      <h1 className="flex justify-center text-heading1-bold">
        TFT vod tracker
      </h1>

      <div className="flex flex-row mt-4 items-center justify-between gap-2 md:mt-8">
        <Search placeholder="enter a streamer" />
        <AddStreamer />
      </div>

      <Suspense key={query + currentPage} fallback={<StreamerTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}


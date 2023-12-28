import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import Link from 'next/link';

export function ViewVod({
  streamerId,
  vodId,
}: {
  streamerId: string;
  vodId: string;
}) {
  return (
    <Link
      href={`/streamer/${streamerId}/vod/${vodId}`}
      className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-light-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <span className="hidden md:block">View Vod</span>{' '}
      <ArrowRightIcon className="h-5 md:ml-4" />
    </Link>
  );
}


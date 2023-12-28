import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { updateStreamer } from '@/app/lib/actions/streamer.actions';

export function AddStreamer() {
  return (
    <Link
      href="/streamer/add"
      className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-light-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <span className="hidden md:block">Add Streamer</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ViewStreamer({ id, text }: { id: string; text: string }) {
  return (
    <Link
      href={`/streamer/${id}`}
      className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-light-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <span className="hidden md:block">{text}</span>{' '}
    </Link>
  );
}

export function Home() {
  return (
    <Link
      href={`/`}
      className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-light-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <span className="hidden md:block">Home</span>{' '}
    </Link>
  );
}

export function UpdateStreamer() {
  return (
    <Link
      href={`/`}
      className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-light-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <span className="hidden md:block">Update</span>{' '}
    </Link>
  );
}


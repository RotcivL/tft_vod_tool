import Image from 'next/image';
import { fetchFilteredStreamers } from '@/app/lib/actions/streamer.actions';
import { ViewStreamer } from '@/app/ui/streamers/buttons';
import { formatDateToLocal } from '@/app/lib/utils';

export default async function StreamerTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const streamers = await fetchFilteredStreamers(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Twitch Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Summoner Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Last Update
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {streamers?.map(streamer => (
                <tr
                  key={streamer._id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={streamer.profilePicture}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${streamer.twitchName}'s profile picture`}
                      />
                      <p>{streamer.twitchName}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {streamer.summonerName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(streamer.lastUpdate)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ViewStreamer id={streamer._id} text="View Streamer" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


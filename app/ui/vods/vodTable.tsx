import { VodType } from '@/app/lib/types';
import { ViewVod } from './buttons';

export default async function VodTable({
  streamer,
  vods,
}: {
  streamer: string;
  vods: VodType[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Placement Average
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {vods?.map(vod => (
                <tr
                  key={vod.vodId}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <td className="whitespace-nowrap px-3 py-3">
                    {vod.startTime.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{vod.avg}</td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ViewVod streamerId={streamer} vodId={vod.vodId} />
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


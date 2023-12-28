'use client';
import { Match } from '@/app/lib/types';
import Image from 'next/image';
import tftAugments from '@/app/constants/tft-augments.json';
import tftChampions from '@/app/constants/tft-champion.json';
import tftItems from '@/app/constants/tft-item.json';
import { StarIcon } from '@heroicons/react/24/solid';
import { secondsToTimestamp } from '@/app/lib/utils';
import { forwardRef } from 'react';

export default function MatchTable({
  matches,
  setTime,
}: {
  matches: Match[];
  setTime: (seconds: number) => void;
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  Timestamp
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Placement
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Augments
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Champions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {matches?.map(match => {
                const vodTimeStamp = parseInt(match.vodTime) / 1000;

                return (
                  <tr
                    key={match._id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                    <td className="whitespace-nowrap px-3 py-3">
                      <button onClick={() => setTime(vodTimeStamp)}>
                        {secondsToTimestamp(vodTimeStamp)}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {match.placement}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center gap-1">
                        {match.augments.map(aug => {
                          return (
                            <Image
                              key={match._id + tftAugments.data[aug].id}
                              src={`/tft/tft-augment/${tftAugments.data[aug].image.full}`}
                              width={24}
                              height={24}
                              alt={`${aug}'s image`}
                            />
                          );
                        })}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex gap-1">
                        {match.units.map((unit, unitId) => {
                          const tier =
                            tftChampions.data[unit.character_id].tier;

                          return (
                            <div key={unitId} className="flex flex-col gap-1">
                              <div className="flex justify-center">
                                {[...Array.from(Array(unit.tier).keys())].map(
                                  (_, i) => (
                                    <StarIcon
                                      key={i}
                                      className="h-3 text-yellow"
                                    />
                                  )
                                )}
                              </div>
                              <Image
                                src={`/tft/tft-champion/${
                                  tftChampions.data[unit.character_id].image
                                    .full
                                }`}
                                width={45}
                                height={45}
                                className={`rounded-lg border-[2.5px] ${
                                  tier === 1
                                    ? 'border-unit-1'
                                    : tier === 2
                                    ? 'border-unit-2'
                                    : tier === 3
                                    ? 'border-unit-3'
                                    : tier === 4
                                    ? 'border-unit-4'
                                    : 'border-unit-5'
                                }`}
                                alt={`${unit.character_id} image`}
                              />

                              <div className="flex gap-[1px]">
                                {unit.itemNames.map((item, itemId) => (
                                  <Image
                                    key={itemId}
                                    src={`/tft/tft-item/${tftItems.data[item].image.full}`}
                                    width={14}
                                    height={14}
                                    alt={`${item} image`}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


'use client';

import { addStreamer } from '@/app/lib/actions/streamer.actions';
import { Region } from '@/app/constants/regions';
import { State } from '@/app/lib/types';
import Button from '@/app/ui/button';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { SubmitButton } from './submitButton';

export default function Form() {
  const initialState = { errors: {}, message: null };
  const [state, dispatch] = useFormState<State, FormData>(
    addStreamer,
    initialState
  );
  const { pending } = useFormStatus();
  console.log(pending);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label
            htmlFor="twitchName"
            className="mb-2 block text-sm font-medium">
            Enter Streamer Twitch Name
          </label>
          <div className="relative">
            <input
              id="twitchName"
              name="twitchName"
              type="text"
              placeholder="Enter Twitch name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="twitch-error"
            />
          </div>
          {state?.errors?.twitchName ? (
            <div
              id="twitch-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-500">
              {state.errors.twitchName.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="summonerName"
            className="mb-2 block text-sm font-medium">
            Enter Streamer Summoner Name
          </label>
          <div className="relative">
            <input
              id="summonerName"
              name="summonerName"
              type="text"
              placeholder="Enter Summoner name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
          {state?.errors?.summonerName ? (
            <div
              id="twitch-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-500">
              {state.errors.summonerName.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label htmlFor="tag" className="mb-2 block text-sm font-medium">
            Enter Streamer Riot Tag
          </label>
          <div className="relative">
            <input
              id="tag"
              name="tag"
              type="text"
              placeholder="Enter tag"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
          {state?.errors?.tag ? (
            <div
              id="tag-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-500">
              {state.errors.tag.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label htmlFor="region" className="mb-2 block text-sm font-medium">
            Select a region
          </label>
          <div className="relative">
            <select
              id="region"
              name="region"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue="">
              <option value="" disabled>
                Select a region
              </option>
              {Object.entries(Region).map(([key, value]) => (
                <option key={key} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
        {state?.errors?.region ? (
          <div
            id="region-error"
            aria-live="polite"
            className="mt-2 text-sm text-red-500">
            {state.errors.region.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        ) : null}
        {state?.message ? (
          <div
            id="missing-fields-error"
            aria-live="polite"
            className="mt-2 text-sm text-red-500">
            <p>{state.message}</p>
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancel
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}


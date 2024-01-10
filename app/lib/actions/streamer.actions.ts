'use server';

import { Types } from 'mongoose';
import { connectToDB } from '../mongoose';
import { Region } from '@/app/constants/regions';
import { getMatches, getPuuid } from '@/app/api/riot';
import { getUserId, getVods } from '@/app/api/twitch';
import {
  State,
  StreamerType,
  StreamerTable,
  RegionKey,
  VodType,
} from '@/app/lib/types';
import { z } from 'zod';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Streamer from '@/app/lib/models/streamer.model';
import Vod from '@/app/lib/models/vod.model';
import Match from '@/app/lib/models/match.model';

const AddStreamer = z.object({
  twitchName: z
    .string({ required_error: 'Please enter a twitch streamer' })
    .min(1),
  summonerName: z
    .string({ required_error: 'Please enter a summoner name' })
    .min(1),
  tag: z.string({ required_error: 'Please enter a tag' }).min(1),
  region: z.nativeEnum(Region),
});

const DAY_IN_MILLI = 1000 * 60 * 60 * 24;
export async function addStreamer(prevState: State, formData: FormData) {
  const validatedFields = AddStreamer.safeParse({
    twitchName: formData.get('twitchName'),
    summonerName: formData.get('summonerName'),
    tag: formData.get('tag'),
    region: formData.get('region'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to add streamer',
    };
  }
  const { twitchName, summonerName, tag, region } = validatedFields.data;

  const riotRes = await getPuuid(summonerName, tag);
  if (!riotRes.found) {
    return {
      message: 'Summoner not found',
    };
  }

  const twitchRes = await getUserId(twitchName);
  if (!twitchRes.found) {
    return {
      message: 'Twitch streamer not found',
    };
  }

  try {
    connectToDB();
    const updateTime = Date.now() - 2 * DAY_IN_MILLI;
    const vods = await updateVods(
      twitchRes.user as string,
      riotRes.puuid,
      region,
      updateTime
    );
    console.log(vods);
    const newStreamer = new Streamer({
      twitchName,
      summonerName,
      region,
      twitchId: twitchRes.user,
      profilePicture: twitchRes.profilePicture,
      puuid: riotRes.puuid,
      vods: vods,
    });

    await newStreamer.save();
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to add new streamer',
    };
  }
  revalidatePath('/');
  redirect('/');
}

export async function updateStreamer(id: string) {
  try {
    connectToDB();

    const streamer = await Streamer.findById(id);
    const vods = await updateVods(
      streamer.twitchId,
      streamer.puuid,
      streamer.region,
      streamer.lastUpdate.getTime()
    );
    const vodIds = vods.map(vod => {
      return vod._id;
    });

    streamer.vods = vodIds.concat(streamer.vods);
    streamer.lastUpdate = Date.now();
    await streamer.save();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update streamer.');
  }
  revalidatePath(`/streamer/${id}`);
  redirect(`/streamer/${id}`);
}

async function updateVods(
  twitchId: string,
  puuid: string,
  region: string,
  lastUpdate: number
) {
  const vods = await getVods(twitchId, lastUpdate);
  // console.log(vods);

  const savedVods: VodType[] = await Promise.all(
    vods.map(async vod => {
      const startTime = vod.creationDate.getTime();
      const endTime = startTime + vod.durationInSeconds * 1000;
      console.log(startTime, endTime);

      const matches = await getMatches(
        puuid,
        region as RegionKey,
        startTime,
        endTime
      );

      let sum = 0;
      const savedMatches = await Promise.all(
        matches.map(match => {
          const newMatch = new Match({
            vodTime: match.startTime - startTime,
            placement: match.placement,
            augments: match.augments,
            units: match.units,
            traits: match.traits,
          });
          const savedMatch = newMatch.save();
          sum += match.placement;
          return savedMatch;
        })
      );
      const avg = sum / matches.length;
      const newVod = new Vod({
        vodId: vod.id,
        startTime: vod.creationDate,
        matches: savedMatches,
        avg: avg.toPrecision(3),
      });
      const savedVod = newVod.save();

      return savedVod;
    })
  );

  return savedVods;
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredStreamers(
  query: string,
  currentPage: number
) {
  const queryRegex = new RegExp(query, 'i');
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    connectToDB();
    const streamers: StreamerTable[] = await Streamer.find()
      .or([{ twitchName: queryRegex }, { summonerName: queryRegex }])
      .sort({ lastUpdate: 'desc' })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .exec();

    return streamers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch streamers.');
  }
}

export async function fetchStreamerPages(query: string) {
  const queryRegex = new RegExp(query, 'i');
  try {
    connectToDB();
    const count = await Streamer.find()
      .or([{ twitchName: queryRegex }, { summonerName: queryRegex }])
      .countDocuments()
      .exec();

    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of streamers.');
  }
}

export async function fetchStreamerFilteredVods(
  id: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    connectToDB();
    const streamer = await Streamer.findById(id)
      .populate({
        path: 'vods',
        model: Vod,
        options: {
          sort: { startTime: -1 },
          skip: offset,
          perDocumentLimit: ITEMS_PER_PAGE,
        },
      })
      .exec();

    return streamer;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch streamer.');
  }
}

export async function fetchVodPages(id: string) {
  try {
    connectToDB();
    const [count] = await Streamer.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $project: {
          count: { $size: '$vods' },
        },
      },
    ]);

    const totalPages = Math.ceil(Number(count.count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of vods.');
  }
}

export async function fetchVod(id: string) {
  try {
    connectToDB();
    const vod = await Vod.findById(id)
      .populate({
        path: 'matches',
        model: Match,
        options: {
          sort: { vodTime: 1 },
        },
      })
      .exec();

    return vod.toObject({ flattenObjectIds: true });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vod.');
  }
}


'use server';

import { RateLimiter } from 'limiter';
import { MatchDto, RegionKey, Env } from '../lib/types';
import riotRoutes from '@/app/constants/riotRoutes.json';

const twoMinuteLimiter = new RateLimiter({
  tokensPerInterval: 50,
  interval: 1000 * 120,
});
const secondLimiter = new RateLimiter({
  tokensPerInterval: 5,
  interval: 'second',
});

async function getRiotKey() {
  const res = await fetch(
    'https://api.vercel.com/v8/projects/prj_YlgsLi7mqhfE4bLMMBhmAzvqBXy9/env?decrypt=true',
    {
      headers: {
        Authorization: ('Bearer ' + process.env.VERCEL) as string,
      },
      method: 'get',
      cache: 'no-store',
    }
  );
  if (res.status != 200) {
    console.log('Error getting riot key');
    throw new Error('Error getting riot key');
  }
  const envs: Env = await res.json();
  const riotEnv = envs.envs.find(env => env.key === 'RIOT_API_KEY');
  if (!riotEnv?.value) {
    console.log('Error getting riot key');
    throw new Error('Error getting riot key');
  }
  return riotEnv.value;
}

export async function getPuuid(summonerName: string, tag: string) {
  await twoMinuteLimiter.removeTokens(1);
  await secondLimiter.removeTokens(1);
  const riotKey = await getRiotKey();
  console.log(riotKey);

  const url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Riot-Token': riotKey,
    },
    cache: 'no-store',
  });

  if (res.status === 404) {
    return {
      found: false,
    };
  }

  const data = await res.json();

  return { found: true, puuid: data.puuid };
}

export async function getMatches(
  puuid: string,
  region: RegionKey,
  startTime: number,
  endTime: number
) {
  await twoMinuteLimiter.removeTokens(1);
  await secondLimiter.removeTokens(1);
  const riotKey = await getRiotKey();
  const routeRegion = riotRoutes[region];
  const url = new URL(
    `https://${routeRegion}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids`
  );
  url.searchParams.set('startTime', (startTime / 1000).toString());
  url.searchParams.set('endTime', (endTime / 1000).toString());
  url.searchParams.set('count', '100');

  const res = await fetch(url.href, {
    headers: {
      'Content-Type': 'application/json',
      'X-Riot-Token': riotKey,
    },
    cache: 'no-store',
  });

  const matchIds: string[] = await res.json();
  console.log(matchIds);
  const matches = await Promise.all(
    matchIds.map((matchId: string) =>
      getMatch(matchId, routeRegion, puuid, riotKey)
    )
  );

  return matches;
}

async function getMatch(
  matchId: string,
  routeRegion: string,
  puuid: string,
  riotKey: string
) {
  await twoMinuteLimiter.removeTokens(1);
  await secondLimiter.removeTokens(1);
  const url = `https://${routeRegion}.api.riotgames.com/tft/match/v1/matches/${matchId}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Riot-Token': riotKey,
    },
    cache: 'no-store',
  });

  const matchDTO: MatchDto = await res.json();

  const index = matchDTO.metadata.participants.findIndex(
    elem => elem === puuid
  );
  const units = matchDTO.info.participants[index].units.map(
    ({ rarity, name, ...rest }) => rest
  );

  const traits = matchDTO.info.participants[index].traits.map(
    ({ num_units, style, tier_total, ...rest }) => rest
  );

  const match = {
    startTime: matchDTO.info.game_datetime - matchDTO.info.game_length * 1000,
    placement: matchDTO.info.participants[index].placement,
    augments: matchDTO.info.participants[index].augments,
    units: units,
    traits: traits,
  };

  return match;
}


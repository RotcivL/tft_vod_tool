'use server';

import { RateLimiter } from 'limiter';
import { MatchDto, RegionKey } from '../lib/types';
import riotRoutes from '@/app/constants/riotRoutes.json';

const twoMinuteLimiter = new RateLimiter({
  tokensPerInterval: 95,
  interval: 1000 * 120,
});
const secondLimiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'second',
});

export async function getPuuid(summonerName: string, tag: string) {
  await twoMinuteLimiter.removeTokens(1);
  await secondLimiter.removeTokens(1);
  const url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Riot-Token': process.env.RIOT_API_KEY as string,
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
      'X-Riot-Token': process.env.RIOT_API_KEY as string,
    },
    cache: 'no-store',
  });

  const matchIds: string[] = await res.json();
  // console.log(matchIds);
  const matches = await Promise.all(
    matchIds.map((matchId: string) => getMatch(matchId, routeRegion, puuid))
  );

  return matches;
}

async function getMatch(matchId: string, routeRegion: string, puuid: string) {
  await twoMinuteLimiter.removeTokens(1);
  await secondLimiter.removeTokens(1);
  const url = `https://${routeRegion}.api.riotgames.com/tft/match/v1/matches/${matchId}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Riot-Token': process.env.RIOT_API_KEY as string,
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


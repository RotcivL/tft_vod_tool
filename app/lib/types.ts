import riotRoutes from '@/app/constants/riotRoutes.json';
import tftAugments from '@/app/constants/tft-augments.json';
import tftChampions from '@/app/constants/tft-champion.json';
import tftItems from '@/app/constants/tft-item.json';

export interface StreamerTable {
  _id: string;
  twitchName: string;
  summonerName: string;
  profilePicture: string;
  lastUpdate: Date;
}

export interface VodType {
  _id: string;
  vodId: string;
  startTime: Date;
  matches: Match[];
  avg: string;
}

export interface Match {
  _id: string;
  vodTime: string;
  placement: string;
  augments: augmentType[];
  units: Unit[];
  traits: Trait[];
}

export interface MatchDto {
  metadata: {
    data_version: string;
    match_id: string;
    participants: string[];
  };
  info: {
    game_datetime: number;
    game_length: number;
    game_variation: string;
    game_version: string;
    participants: [
      {
        augments: string[];
        companion: {
          content_ID: string;
          item_ID: string;
          skin_ID: string;
          species: string;
        };
        gold_left: number;
        last_round: number;
        level: number;
        placement: number;
        players_eliminated: number;
        puuid: string;
        time_eliminated: number;
        total_damage_to_players: number;
        traits: [
          {
            name: string;
            num_units: number;
            style: number;
            tier_current: number;
            tier_total: number;
          }
        ];
        units: [
          {
            itemNames: string[];
            character_id: string;
            name: string;
            rarity: number;
            tier: number;
          }
        ];
      }
    ];
    queue_id: number;
    tft_set_number: number;
  };
}

export interface Unit {
  itemNames: itemType[];
  character_id: championType;
  tier: number;
}

export interface Trait {
  name: string;
  tier: number;
}

export interface StreamerType extends StreamerTable {
  region: string;
  twitchId: string;
  puuid: string;
  vods: VodType[];
}

export interface State {
  errors?: {
    twitchName?: string[];
    summonerName?: string[];
    tag?: string[];
    region?: string[];
  };
  message?: string | null;
}

export type RegionKey = keyof typeof riotRoutes;

export type Env = {
  envs: {
    target?:
      | ('production' | 'preview' | 'development' | 'preview' | 'development')[]
      | ('production' | 'preview' | 'development' | 'preview' | 'development');
    type?: 'secret' | 'system' | 'encrypted' | 'plain' | 'sensitive';
    id?: string;
    key?: string;
    value?: string;
    configurationId?: string | null;
    createdAt?: number;
    updatedAt?: number;
    createdBy?: string | null;
    updatedBy?: string | null;
    gitBranch?: string;
    edgeConfigId?: string | null;
    edgeConfigTokenId?: string | null;
    contentHint?:
      | (
          | {
              type: 'redis-url';
              storeId: string;
            }
          | {
              type: 'redis-rest-api-url';
              storeId: string;
            }
          | {
              type: 'redis-rest-api-token';
              storeId: string;
            }
          | {
              type: 'redis-rest-api-read-only-token';
              storeId: string;
            }
          | {
              type: 'blob-read-write-token';
              storeId: string;
            }
          | {
              type: 'postgres-url';
              storeId: string;
            }
          | {
              type: 'postgres-url-non-pooling';
              storeId: string;
            }
          | {
              type: 'postgres-prisma-url';
              storeId: string;
            }
          | {
              type: 'postgres-user';
              storeId: string;
            }
          | {
              type: 'postgres-host';
              storeId: string;
            }
          | {
              type: 'postgres-password';
              storeId: string;
            }
          | {
              type: 'postgres-database';
              storeId: string;
            }
          | { [key: string]: unknown }
        )
      | null;
    decrypted?: boolean;
    comment?: string;
    system?: boolean;
  }[];
};
type augmentType = keyof typeof tftAugments.data;

type championType = keyof typeof tftChampions.data;

type itemType = keyof typeof tftItems.data;


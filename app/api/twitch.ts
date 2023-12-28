import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';

const authProvider = new AppTokenAuthProvider(
  process.env.TWITCH_CLIENT_ID as string,
  process.env.TWITCH_CLIENT_SECRET as string
);

const apiClient = new ApiClient({ authProvider });

export async function getUserId(twitchName: string) {
  const user = await apiClient.users.getUserByName(twitchName);
  if (!user) {
    return { found: false };
  }

  return { found: true, user: user.id, profilePicture: user.profilePictureUrl };
}

export async function getVods(twitchId: string, timestamp: number) {
  const res = await apiClient.videos.getVideosByUser(twitchId, {
    period: 'week',
    type: 'archive',
  });

  const vods = res.data.filter(vid => vid.creationDate.getTime() > timestamp);

  return vods;
}


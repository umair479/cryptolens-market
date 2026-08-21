// Database disabled - public access mode, no authentication required

export async function getDb() {
  return null;
}

export async function upsertUser(_user: Record<string, unknown>): Promise<void> {
  // no-op
}

export async function getUserById(_id: string) {
  return undefined;
}

export async function getUserByOpenId(_openId: string) {
  return undefined;
}

export async function getUserWatchlist(_userId: string) {
  return [];
}

export async function addUserWatchlistItem(_userId: string, _coinId: string) {
  return [];
}

export async function removeUserWatchlistItem(_userId: string, _coinId: string) {
  return [];
}

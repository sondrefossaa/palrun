import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "dev_session";
const PROFILE_PREFIX = "dev_profile:";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface MockUser {
  id: string;
  email: string;
  created_at: string;
}

export interface MockSession {
  user: MockUser;
  expires_at: string;
}

export interface MockProfile {
  username: string;
  website: string;
  avatar_url: string | null;
}

export const DEFAULT_PROFILE: MockProfile = {
  username: "",
  website: "",
  avatar_url: null,
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const deriveUserId = (email: string) => {
  const normalized = normalizeEmail(email);
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  return `mock-${Math.abs(hash).toString(36)}`;
};

const buildMockUser = (email: string): MockUser => ({
  id: deriveUserId(email),
  email: normalizeEmail(email),
  created_at: new Date().toISOString(),
});

const buildMockSession = (
  user: MockUser,
  ttlMs: number = ONE_WEEK_MS,
): MockSession => ({
  user,
  expires_at: new Date(Date.now() + ttlMs).toISOString(),
});

const sessionExpired = (session: MockSession) =>
  new Date(session.expires_at).getTime() <= Date.now();

async function persistSession(session: MockSession) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

async function ensureProfile(user: MockUser): Promise<MockProfile> {
  const existing = await getProfile(user.id);
  if (existing) return existing;

  await saveProfile(user.id, DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}

async function sessionFromEmail(email: string): Promise<MockSession> {
  const user = buildMockUser(email);
  await ensureProfile(user);
  const session = buildMockSession(user);
  await persistSession(session);
  return session;
}

export async function getStoredMockSession(): Promise<MockSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as MockSession;
    if (!sessionExpired(session)) {
      await ensureProfile(session.user);
      return session;
    }
  } catch (error) {
    console.warn("Unable to parse mock session", error);
  }

  await clearMockSession();
  return null;
}

export async function mockLogin(
  email: string,
  password: string,
): Promise<MockSession> {
  if (!email || !password) throw new Error("Email and password are required");
  return sessionFromEmail(email);
}

export async function mockRegister(
  email: string,
  password: string,
  profileOverrides?: Partial<MockProfile>,
): Promise<MockSession> {
  if (!email || !password) throw new Error("Email and password are required");
  if (password.length < 6)
    throw new Error("Password must be at least 6 characters");

  const session = await sessionFromEmail(email);

  if (profileOverrides && Object.keys(profileOverrides).length > 0) {
    await saveProfile(session.user.id, profileOverrides);
  }

  return session;
}

export async function mockSignOut(): Promise<void> {
  await clearMockSession();
}

export async function clearMockSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getProfile(userId: string): Promise<MockProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_PREFIX + userId);
  if (!raw) return null;

  try {
    const profile = JSON.parse(raw) as MockProfile;
    return { ...DEFAULT_PROFILE, ...profile };
  } catch (error) {
    console.warn("Unable to parse mock profile", error);
    await AsyncStorage.removeItem(PROFILE_PREFIX + userId);
    return null;
  }
}

export async function saveProfile(
  userId: string,
  overrides: Partial<MockProfile>,
): Promise<MockProfile> {
  const existing = (await getProfile(userId)) ?? DEFAULT_PROFILE;
  const nextProfile: MockProfile = {
    username: overrides.username ?? existing.username,
    website: overrides.website ?? existing.website,
    avatar_url: overrides.avatar_url ?? existing.avatar_url,
  };

  await AsyncStorage.setItem(
    PROFILE_PREFIX + userId,
    JSON.stringify(nextProfile),
  );
  return nextProfile;
}

export async function mockUpdateProfile(
  session: MockSession | null,
  updates: Partial<MockProfile>,
): Promise<MockProfile> {
  if (!session?.user) throw new Error("No authenticated user");
  return saveProfile(session.user.id, updates);
}

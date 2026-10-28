import fs from "fs";
import path from "path";
import {
  DEFAULT_INVITATION_CONFIG,
  type InvitationConfig,
  type FeatureFlags,
} from "./invitation-types";
import type { RsvpSubmission } from "./rsvp";

export interface ServerWish {
  _id: string;
  name: string;
  attendance: string;
  guests: number;
  message: string;
  createdAt: string;
}

export interface SongRequest {
  id: string;
  title: string;
  artist: string;
  requestedBy: string;
  createdAt: string;
}

export interface GuestRecord {
  id: string;
  name: string;
  slug: string;
  phone?: string;
  seats: number;
  customNote?: string;
  link: string;
  createdAt: string;
}

export interface AppServerData {
  invitation: InvitationConfig;
  rsvps: RsvpSubmission[];
  wishes: ServerWish[];
  songs: SongRequest[];
  guests: GuestRecord[];
  activeSessions: Record<string, { role: string; createdAt: string }>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "app-data.json");

const INITIAL_SERVER_RSVPS: RsvpSubmission[] = [
  {
    id: "rsvp-1",
    guestName: "Alexander Hamilton & Elizabeth",
    attendanceStatus: "Yes",
    numberOfAttendees: 2,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "rsvp-2",
    guestName: "David Jonathan",
    attendanceStatus: "Yes",
    numberOfAttendees: 1,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "rsvp-3",
    guestName: "Amanda Valerie",
    attendanceStatus: "No",
    numberOfAttendees: 0,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "rsvp-4",
    guestName: "Budi Santoso & Partner",
    attendanceStatus: "Yes",
    numberOfAttendees: 2,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const INITIAL_SERVER_WISHES: ServerWish[] = [
  {
    _id: "wish-1",
    name: "Jonathan & Sarah",
    attendance: "Hadir",
    guests: 2,
    message: "Wishing you both a lifetime of love and happiness! Congratulations on your special day!",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    _id: "wish-2",
    name: "Michael Chen",
    attendance: "Hadir",
    guests: 1,
    message: "Warmest congratulations to the lovely couple! So excited to celebrate with you.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: "wish-3",
    name: "Amanda Valerie",
    attendance: "Tidak Hadir",
    guests: 1,
    message: "Sending my heartfelt congratulations from afar! May your marriage be abundantly blessed.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    _id: "wish-4",
    name: "Budi Santoso",
    attendance: "Hadir",
    guests: 2,
    message: "Selamat menempuh hidup baru Mikha & Clara! Bahagia dan langgeng selalu sampai kakek nenek.",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const INITIAL_SERVER_SONGS: SongRequest[] = [
  {
    id: "song-1",
    title: "Can't Help Falling in Love",
    artist: "Kina Grannis",
    requestedBy: "Sarah",
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
  {
    id: "song-2",
    title: "A Thousand Years",
    artist: "Christina Perri",
    requestedBy: "Michael",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

const INITIAL_SERVER_GUESTS: GuestRecord[] = [
  {
    id: "guest-1",
    name: "Alexander Hamilton",
    slug: "alexander-hamilton",
    phone: "+62 812 3456 7890",
    seats: 2,
    customNote: "VIP Table 1",
    link: "/to/alexander-hamilton",
    createdAt: new Date().toISOString(),
  },
  {
    id: "guest-2",
    name: "David Jonathan",
    slug: "david-jonathan",
    phone: "+62 813 9876 5432",
    seats: 1,
    customNote: "Groom's Highschool Friend",
    link: "/to/david-jonathan",
    createdAt: new Date().toISOString(),
  },
  {
    id: "guest-3",
    name: "Amanda Valerie",
    slug: "amanda-valerie",
    phone: "+62 815 1122 3344",
    seats: 1,
    customNote: "Bride's Colleague",
    link: "/to/amanda-valerie",
    createdAt: new Date().toISOString(),
  },
];

let cachedData: AppServerData | null = null;

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("Could not create data directory, using memory:", err);
  }
}

export function getServerData(): AppServerData {
  if (cachedData) {
    return cachedData;
  }

  ensureDataDirectory();

  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      cachedData = {
        invitation: {
          ...DEFAULT_INVITATION_CONFIG,
          ...(parsed.invitation || {}),
          features: {
            ...DEFAULT_INVITATION_CONFIG.features,
            ...(parsed.invitation?.features || {}),
          },
          venues: {
            ...DEFAULT_INVITATION_CONFIG.venues,
            ...(parsed.invitation?.venues || {}),
          },
          groom: {
            ...DEFAULT_INVITATION_CONFIG.groom,
            ...(parsed.invitation?.groom || {}),
          },
          bride: {
            ...DEFAULT_INVITATION_CONFIG.bride,
            ...(parsed.invitation?.bride || {}),
          },
          dressCode: {
            ...DEFAULT_INVITATION_CONFIG.dressCode,
            ...(parsed.invitation?.dressCode || {}),
          },
          digitalEnvelope: {
            ...DEFAULT_INVITATION_CONFIG.digitalEnvelope,
            ...(parsed.invitation?.digitalEnvelope || {}),
          },
        },
        rsvps: Array.isArray(parsed.rsvps) ? parsed.rsvps : INITIAL_SERVER_RSVPS,
        wishes: Array.isArray(parsed.wishes) ? parsed.wishes : INITIAL_SERVER_WISHES,
        songs: Array.isArray(parsed.songs) ? parsed.songs : INITIAL_SERVER_SONGS,
        guests: Array.isArray(parsed.guests) ? parsed.guests : INITIAL_SERVER_GUESTS,
        activeSessions: parsed.activeSessions || {},
      };
      return cachedData!;
    }
  } catch (e) {
    console.warn("Could not read server data file, using defaults:", e);
  }

  cachedData = {
    invitation: DEFAULT_INVITATION_CONFIG,
    rsvps: INITIAL_SERVER_RSVPS,
    wishes: INITIAL_SERVER_WISHES,
    songs: INITIAL_SERVER_SONGS,
    guests: INITIAL_SERVER_GUESTS,
    activeSessions: {},
  };

  saveServerData(cachedData);
  return cachedData;
}

export function saveServerData(data: AppServerData): void {
  cachedData = data;
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write server data file to disk:", err);
  }
}

// ----------------- Auth Helpers -----------------

export function createServerSession(role: string = "host"): string {
  const data = getServerData();
  const token = `inviti_sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  data.activeSessions[token] = {
    role,
    createdAt: new Date().toISOString(),
  };
  saveServerData(data);
  return token;
}

export function validateServerSession(token?: string | null): boolean {
  if (!token) return false;
  // Always allow demo token
  if (token === "demo_host_token" || token === "inviti_admin_session") return true;
  const data = getServerData();
  return Boolean(data.activeSessions[token]);
}

export function removeServerSession(token?: string | null): void {
  if (!token) return;
  const data = getServerData();
  if (data.activeSessions[token]) {
    delete data.activeSessions[token];
    saveServerData(data);
  }
}

// ----------------- Invitation Helpers -----------------

export function getStoredInvitation(): InvitationConfig {
  return getServerData().invitation;
}

export function updateStoredInvitation(partial: Partial<InvitationConfig>): InvitationConfig {
  const data = getServerData();
  data.invitation = {
    ...data.invitation,
    ...partial,
    features: {
      ...data.invitation.features,
      ...(partial.features || {}),
    },
    venues: {
      ...data.invitation.venues,
      ...(partial.venues || {}),
    },
    groom: {
      ...data.invitation.groom,
      ...(partial.groom || {}),
    },
    bride: {
      ...data.invitation.bride,
      ...(partial.bride || {}),
    },
    dressCode: {
      ...data.invitation.dressCode,
      ...(partial.dressCode || {}),
    },
    digitalEnvelope: {
      ...data.invitation.digitalEnvelope,
      ...(partial.digitalEnvelope || {}),
    },
  };
  saveServerData(data);
  return data.invitation;
}

export function toggleStoredFeature(
  feature: keyof FeatureFlags,
  explicitValue?: boolean
): FeatureFlags {
  const data = getServerData();
  const currentValue = data.invitation.features[feature];
  const newValue = typeof explicitValue === "boolean" ? explicitValue : !currentValue;
  data.invitation.features[feature] = newValue;
  saveServerData(data);
  return data.invitation.features;
}

// ----------------- RSVP Helpers -----------------

export function getStoredRsvps(): RsvpSubmission[] {
  return getServerData().rsvps;
}

export function addStoredRsvp(record: {
  guestName: string;
  attendanceStatus: "Yes" | "No";
  numberOfAttendees: number;
}): RsvpSubmission {
  const data = getServerData();
  const newRsvp: RsvpSubmission = {
    id: `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    guestName: record.guestName.trim(),
    attendanceStatus: record.attendanceStatus,
    numberOfAttendees: record.attendanceStatus === "Yes" ? Math.max(1, record.numberOfAttendees) : 0,
    createdAt: new Date().toISOString(),
  };

  // Replace if existing guestName, otherwise prepend
  const existingIdx = data.rsvps.findIndex(
    (r) => r.guestName.toLowerCase() === newRsvp.guestName.toLowerCase()
  );
  if (existingIdx >= 0) {
    data.rsvps[existingIdx] = newRsvp;
  } else {
    data.rsvps.unshift(newRsvp);
  }
  saveServerData(data);
  return newRsvp;
}

export function deleteStoredRsvp(id: string): boolean {
  const data = getServerData();
  const initialLength = data.rsvps.length;
  data.rsvps = data.rsvps.filter((r) => r.id !== id);
  const changed = data.rsvps.length !== initialLength;
  if (changed) {
    saveServerData(data);
  }
  return changed;
}

// ----------------- Wishes Helpers -----------------

export function getStoredWishes(page: number = 1, limit: number = 10) {
  const data = getServerData();
  const total = data.wishes.length;
  const start = (page - 1) * limit;
  const paginated = data.wishes.slice(start, start + limit);
  return {
    wishes: paginated,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    currentPage: page,
  };
}

export function addStoredWish(wishData: {
  name: string;
  attendance: string;
  guests: number;
  message: string;
}): ServerWish {
  const data = getServerData();
  const newWish: ServerWish = {
    _id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: wishData.name.trim(),
    attendance: wishData.attendance,
    guests: wishData.guests,
    message: wishData.message.trim(),
    createdAt: new Date().toISOString(),
  };
  data.wishes.unshift(newWish);
  saveServerData(data);
  return newWish;
}

export function deleteStoredWish(id: string): boolean {
  const data = getServerData();
  const initialLength = data.wishes.length;
  data.wishes = data.wishes.filter((w) => w._id !== id);
  if (data.wishes.length !== initialLength) {
    saveServerData(data);
    return true;
  }
  return false;
}

// ----------------- Song Requests Helpers -----------------

export function getStoredSongs(): SongRequest[] {
  return getServerData().songs;
}

export function addStoredSong(song: {
  title: string;
  artist: string;
  requestedBy: string;
}): SongRequest {
  const data = getServerData();
  const newSong: SongRequest = {
    id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: song.title.trim(),
    artist: song.artist.trim(),
    requestedBy: song.requestedBy.trim(),
    createdAt: new Date().toISOString(),
  };
  data.songs.unshift(newSong);
  saveServerData(data);
  return newSong;
}

export function deleteStoredSong(id: string): boolean {
  const data = getServerData();
  const prevLen = data.songs.length;
  data.songs = data.songs.filter((s) => s.id !== id);
  if (data.songs.length !== prevLen) {
    saveServerData(data);
    return true;
  }
  return false;
}

// ----------------- Guests Helpers -----------------

export function getStoredGuests(): GuestRecord[] {
  return getServerData().guests;
}

export function addStoredGuest(guest: {
  name: string;
  phone?: string;
  seats?: number;
  customNote?: string;
}): GuestRecord {
  const data = getServerData();
  const name = guest.name.trim();
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newGuest: GuestRecord = {
    id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    slug,
    phone: guest.phone,
    seats: guest.seats || 1,
    customNote: guest.customNote,
    link: `/to/${slug}`,
    createdAt: new Date().toISOString(),
  };

  data.guests.unshift(newGuest);
  saveServerData(data);
  return newGuest;
}

export function deleteStoredGuest(id: string): boolean {
  const data = getServerData();
  const prevLen = data.guests.length;
  data.guests = data.guests.filter((g) => g.id !== id);
  if (data.guests.length !== prevLen) {
    saveServerData(data);
    return true;
  }
  return false;
}

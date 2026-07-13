// Deterministic dataset. It must be stable across the SSR render and the client
// hydration -- a randomised fixture would produce a hydration mismatch -- and
// stable across requests so pagination is coherent.

const FIRST_NAMES = [
  "Ada",
  "Grace",
  "Alan",
  "Linus",
  "Barbara",
  "Ken",
  "Margaret",
  "Dennis",
  "Radia",
  "Tim",
  "Anita",
  "Guido",
  "Katherine",
  "Bjarne",
  "Sophie",
  "Yukihiro",
];

const LAST_NAMES = [
  "Lovelace",
  "Hopper",
  "Turing",
  "Torvalds",
  "Liskov",
  "Thompson",
  "Hamilton",
  "Ritchie",
  "Perlman",
  "Berners-Lee",
  "Borg",
  "van Rossum",
  "Johnson",
  "Stroustrup",
  "Wilson",
  "Matsumoto",
];

const TEAMS = [
  "Platform",
  "Design",
  "Growth",
  "Infrastructure",
  "Support",
  "Security",
];

export const MEMBER_ROLES = ["owner", "admin", "member", "viewer"] as const;
export const MEMBER_STATUSES = ["active", "invited", "suspended"] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number];
export type MemberStatus = (typeof MEMBER_STATUSES)[number];

export interface Member {
  id: string;
  name: string;
  email: string;
  team: string;
  role: MemberRole;
  status: MemberStatus;
  lastActiveAt: string;
}

export const ACTIVITY_ACTIONS = [
  "signed in",
  "updated billing",
  "invited a teammate",
  "deployed a release",
  "rotated an API key",
  "archived a project",
  "exported a report",
  "changed permissions",
] as const;

export interface ActivityEvent {
  id: string;
  actor: string;
  action: (typeof ACTIVITY_ACTIONS)[number];
  target: string;
  createdAt: string;
}

// Deterministic epoch so timestamps do not drift between server and client.
const EPOCH = Date.parse("2026-07-01T00:00:00.000Z");

// Mulberry32: small, fast, seedable. Enough for fixture data.
function rng(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(random: () => number, values: readonly T[]): T {
  const value = values[Math.floor(random() * values.length)];
  if (value === undefined) {
    throw new Error("pick() requires a non-empty list");
  }
  return value;
}

function buildMembers(count: number): Member[] {
  const random = rng(0x5eed);

  // Draw names from the full cross-product rather than picking each part at
  // random: with 16x16 combinations and 240 members, random picks collide
  // constantly, and because the email is derived from the name that produced
  // several people sharing one address.
  const combinations = FIRST_NAMES.flatMap((first) =>
    LAST_NAMES.map((last) => ({ first, last })),
  );
  if (combinations.length < count) {
    throw new Error(
      `Cannot build ${String(count)} members with unique names from ${String(combinations.length)} combinations`,
    );
  }

  // Deterministic Fisher-Yates, so the order looks arbitrary but never changes.
  for (let i = combinations.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = combinations[i];
    const b = combinations[j];
    if (a && b) {
      combinations[i] = b;
      combinations[j] = a;
    }
  }

  return combinations.slice(0, count).map(({ first, last }, index) => ({
    id: `mem_${String(index + 1).padStart(4, "0")}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase().replaceAll(/[^a-z]/g, "")}@acme.test`,
    team: pick(random, TEAMS),
    role: pick(random, MEMBER_ROLES),
    status: pick(random, MEMBER_STATUSES),
    lastActiveAt: new Date(
      EPOCH - Math.floor(random() * 90) * 86_400_000,
    ).toISOString(),
  }));
}

function buildActivity(count: number, members: Member[]): ActivityEvent[] {
  const random = rng(0xf00d);
  return Array.from({ length: count }, (_, index) => ({
    id: `evt_${String(index + 1).padStart(6, "0")}`,
    actor: pick(random, members).name,
    action: pick(random, ACTIVITY_ACTIONS),
    target: pick(random, TEAMS),
    // Descending: newest first, one minute apart.
    createdAt: new Date(EPOCH - index * 60_000).toISOString(),
  }));
}

export const MEMBERS: Member[] = buildMembers(240);

// Large enough that rendering every row would be visibly slow -- the point of
// virtualising the activity feed.
export const ACTIVITY: ActivityEvent[] = buildActivity(10_000, MEMBERS);

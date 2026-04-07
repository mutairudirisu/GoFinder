import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

type RoommateMember = {
  userId: string;
  name: string;
  joinedAt: string;
};

type RoommateGroup = {
  id: string;
  listingId: string;
  locationKey: string;
  createdAt: string;
  createdBy: {
    userId: string;
    name: string;
  };
  note: string;
  desiredRoommates: number;
  status: "OPEN" | "FULL" | "CLOSED";
  members: RoommateMember[];
};

function getDashboardRoot() {
  const cwd = process.cwd();
  const tail = cwd.split(path.sep).slice(-2).join(path.sep);
  if (tail === path.join("apps", "dashboard")) return cwd;
  return path.join(cwd, "apps", "dashboard");
}

async function resolveDataFilePath() {
  const dashboardRoot = getDashboardRoot();
  const canonical = path.join(dashboardRoot, "src", "data", "roommates.json");
  await fs.mkdir(path.dirname(canonical), { recursive: true });
  try {
    await fs.access(canonical);
  } catch {
    await fs.writeFile(canonical, "[]", "utf8");
  }
  return canonical;
}

async function readAllGroups(): Promise<RoommateGroup[]> {
  try {
    const filePath = await resolveDataFilePath();
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RoommateGroup[]) : [];
  } catch {
    return [];
  }
}

async function writeAllGroups(groups: RoommateGroup[]) {
  const filePath = await resolveDataFilePath();
  await fs.writeFile(filePath, JSON.stringify(groups, null, 2), "utf8");
}

function normalizeId(input: unknown) {
  return decodeURIComponent(String(input ?? "")).trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingId = normalizeId(searchParams.get("listingId"));
  const userId = normalizeId(searchParams.get("userId"));
  const status = normalizeId(searchParams.get("status"));

  const groups = await readAllGroups();
  const filtered = groups
    .filter((g) => (listingId ? normalizeId(g.listingId) === listingId : true))
    .filter((g) => (status ? String(g.status) === status : true))
    .filter((g) => {
      if (!userId) return true;
      if (normalizeId(g.createdBy?.userId) === userId) return true;
      return (g.members ?? []).some((m) => normalizeId(m.userId) === userId);
    })
    .sort((a, b) => (String(a.createdAt) < String(b.createdAt) ? 1 : -1));

  return NextResponse.json({ groups: filtered });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<RoommateGroup> & {
    listingId?: string;
    locationKey?: string;
    createdBy?: { userId?: string; name?: string };
    note?: string;
    desiredRoommates?: number;
  };

  const listingId = normalizeId(body.listingId);
  const locationKey = String(body.locationKey ?? "").trim();
  const createdByUserId = normalizeId(body.createdBy?.userId);
  const createdByName = String(body.createdBy?.name ?? "").trim();
  const note = String(body.note ?? "").trim();
  const desiredRoommates = Number(body.desiredRoommates ?? 1);

  if (!listingId) return NextResponse.json({ error: "Missing listingId" }, { status: 400 });
  if (!locationKey) return NextResponse.json({ error: "Missing locationKey" }, { status: 400 });
  if (!createdByUserId) return NextResponse.json({ error: "Missing createdBy.userId" }, { status: 400 });
  if (!createdByName) return NextResponse.json({ error: "Missing createdBy.name" }, { status: 400 });

  const safeDesired = Number.isFinite(desiredRoommates) ? Math.max(1, Math.min(8, desiredRoommates)) : 1;
  const now = new Date().toISOString();
  const group: RoommateGroup = {
    id: `rg_${Math.random().toString(36).slice(2, 10)}`,
    listingId,
    locationKey,
    createdAt: now,
    createdBy: { userId: createdByUserId, name: createdByName },
    note,
    desiredRoommates: safeDesired,
    status: "OPEN",
    members: [{ userId: createdByUserId, name: createdByName, joinedAt: now }],
  };

  const groups = await readAllGroups();
  const next = [group, ...groups];
  await writeAllGroups(next);

  return NextResponse.json({ group });
}


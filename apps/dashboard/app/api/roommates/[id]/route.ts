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

function toStatus(desiredRoommates: number, membersCount: number): "OPEN" | "FULL" | "CLOSED" {
  const maxMembers = Math.max(2, desiredRoommates + 1);
  if (membersCount >= maxMembers) return "FULL";
  return "OPEN";
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const normalizedId = normalizeId(id);
  const groups = await readAllGroups();
  const group = groups.find((g) => normalizeId(g.id) === normalizedId);
  if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });
  return NextResponse.json({ group });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const normalizedId = normalizeId(id);
  const body = (await request.json()) as any;
  const action = String(body?.action ?? "").trim();

  const groups = await readAllGroups();
  const idx = groups.findIndex((g) => normalizeId(g.id) === normalizedId);
  if (idx === -1) return NextResponse.json({ error: "Group not found" }, { status: 404 });

  const current = groups[idx];
  if (!current) return NextResponse.json({ error: "Group not found" }, { status: 404 });

  if (action === "join") {
    const userId = normalizeId(body?.user?.userId ?? body?.userId);
    const name = String(body?.user?.name ?? body?.name ?? "").trim();
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });
    if (current.status === "CLOSED") return NextResponse.json({ error: "Group closed" }, { status: 400 });

    const exists = (current.members ?? []).some((m) => normalizeId(m.userId) === userId);
    if (exists) return NextResponse.json({ group: current });

    const desired = Number.isFinite(Number(current.desiredRoommates)) ? Number(current.desiredRoommates) : 1;
    const maxMembers = Math.max(2, desired + 1);
    if ((current.members ?? []).length >= maxMembers) {
      const updated: RoommateGroup = { ...current, status: "FULL" };
      groups[idx] = updated;
      await writeAllGroups(groups);
      return NextResponse.json({ group: updated });
    }

    const nextMembers: RoommateMember[] = [
      ...(current.members ?? []),
      { userId, name, joinedAt: new Date().toISOString() },
    ];

    const updated: RoommateGroup = {
      ...current,
      members: nextMembers,
      status: toStatus(desired, nextMembers.length),
    };
    groups[idx] = updated;
    await writeAllGroups(groups);
    return NextResponse.json({ group: updated });
  }

  if (action === "close") {
    const updated: RoommateGroup = { ...current, status: "CLOSED" };
    groups[idx] = updated;
    await writeAllGroups(groups);
    return NextResponse.json({ group: updated });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

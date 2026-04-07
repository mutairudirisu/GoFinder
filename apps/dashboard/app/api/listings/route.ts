import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

function isUserFullyVerified(user: any) {
  const email = user?.verifications?.email?.status;
  const phone = user?.verifications?.phone?.status;
  const id = user?.verifications?.id?.status;
  return email === "VERIFIED" && phone === "VERIFIED" && id === "VERIFIED";
}

function getDashboardRoot() {
  const cwd = process.cwd();
  const tail = cwd.split(path.sep).slice(-2).join(path.sep);
  if (tail === path.join("apps", "dashboard")) return cwd;
  return path.join(cwd, "apps", "dashboard");
}

async function resolveDataFilePath() {
  const dashboardRoot = getDashboardRoot();
  const canonical = path.join(dashboardRoot, "src", "data", "listings.json");
  try {
    await fs.access(path.dirname(canonical));
    return canonical;
  } catch {
    return path.join(process.cwd(), "src", "data", "listings.json");
  }
}

async function resolveUsersFilePath() {
  const dashboardRoot = getDashboardRoot();
  const canonical = path.join(dashboardRoot, "src", "data", "users.json");
  try {
    await fs.access(path.dirname(canonical));
    return canonical;
  } catch {
    return path.join(process.cwd(), "src", "data", "users.json");
  }
}

async function ensureDataFile(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

async function readAllUsers() {
  try {
    const filePath = await resolveUsersFilePath();
    await ensureDataFile(filePath);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function readAllListings() {
  try {
    const filePath = await resolveDataFilePath();
    await ensureDataFile(filePath);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAllListings(listings: unknown[]) {
  const filePath = await resolveDataFilePath();
  await ensureDataFile(filePath);
  await fs.writeFile(filePath, JSON.stringify(listings, null, 2), "utf8");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const listings = await readAllListings();
  const users = await readAllUsers();

  let changed = false;
  const next = listings.map((l: any) => {
    if (l?.status !== "ACTION_REQUIRED") return l;
    const hostId = l?.host?.id;
    if (!hostId) return l;
    const u = users.find((user: any) => String(user?.id ?? "") === String(hostId));
    if (!u) return l;
    if (!isUserFullyVerified(u)) return l;
    changed = true;
    return { ...l, status: "VERIFIED" };
  });

  if (changed) {
    await writeAllListings(next);
  }

  const filtered = status ? next.filter((l: any) => l?.status === status) : next;
  return NextResponse.json({ listings: filtered });
}

export async function POST(request: Request) {
  const body = await request.json();
  const listing = body as any;

  if (!listing?.id) {
    return NextResponse.json({ error: "Missing listing id" }, { status: 400 });
  }

  const users = await readAllUsers();
  const hostId = listing?.host?.id;
  if (hostId) {
    const u = users.find((user: any) => String(user?.id ?? "") === String(hostId));
    if (u && isUserFullyVerified(u)) {
      listing.status = "VERIFIED";
    }
  }

  const listings = await readAllListings();
  const next = listings.filter((l: any) => decodeURIComponent(String(l?.id ?? "")).trim() !== decodeURIComponent(String(listing.id ?? "")).trim());
  next.push(listing);
  await writeAllListings(next);

  return NextResponse.json({ listing });
}

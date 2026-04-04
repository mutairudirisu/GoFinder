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

async function safeReadListings(filePath: string) {
  try {
    await ensureDataFile(filePath);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function readAllListings() {
  const filePath = await resolveDataFilePath();
  return safeReadListings(filePath);
}

async function writeAllListings(listings: unknown[]) {
  const filePath = await resolveDataFilePath();
  await ensureDataFile(filePath);
  await fs.writeFile(filePath, JSON.stringify(listings, null, 2), "utf8");
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const normalizedId = decodeURIComponent(String(id)).trim();
  const updates = (await request.json()) as any;
  const listings = await readAllListings();

  const index = listings.findIndex((l: any) => decodeURIComponent(String(l?.id ?? "")).trim() === normalizedId);
  if (index === -1) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const users = await readAllUsers();
  let updated = { ...listings[index], ...updates };

  if (updated?.status === "ACTION_REQUIRED") {
    const hostId = updated?.host?.id;
    if (hostId) {
      const u = users.find((user: any) => String(user?.id ?? "") === String(hostId));
      if (u && isUserFullyVerified(u)) {
        updated = { ...updated, status: "VERIFIED" };
      }
    }
  }

  const next = [...listings];
  next[index] = updated;
  await writeAllListings(next);

  return NextResponse.json({ listing: updated });
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const normalizedId = decodeURIComponent(String(id)).trim();
  const listings = await readAllListings();
  const index = listings.findIndex((l: any) => decodeURIComponent(String(l?.id ?? "")).trim() === normalizedId);
  const listing = index === -1 ? undefined : listings[index];
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (listing?.status === "ACTION_REQUIRED" && listing?.host?.id) {
    const users = await readAllUsers();
    const u = users.find((user: any) => String(user?.id ?? "") === String(listing.host.id));
    if (u && isUserFullyVerified(u)) {
      const updated = { ...listing, status: "VERIFIED" };
      const next = [...listings];
      next[index] = updated;
      await writeAllListings(next);
      return NextResponse.json({ listing: updated });
    }
  }
  return NextResponse.json({ listing });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const normalizedId = decodeURIComponent(String(id)).trim();

  let body: any = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";

  const listings = await readAllListings();
  const index = listings.findIndex((l: any) => decodeURIComponent(String(l?.id ?? "")).trim() === normalizedId);
  if (index === -1) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const deleted = listings[index];
  const next = listings.filter((_: any, i: number) => i !== index);
  await writeAllListings(next);

  return NextResponse.json({ ok: true, deletedId: normalizedId, reason, listing: deleted });
}

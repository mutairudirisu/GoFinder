import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

function getDashboardRoot() {
  const cwd = process.cwd();
  const tail = cwd.split(path.sep).slice(-2).join(path.sep);
  if (tail === path.join("apps", "dashboard")) return cwd;
  return path.join(cwd, "apps", "dashboard");
}

async function resolveDataFilePath() {
  const dashboardRoot = getDashboardRoot();
  const canonical = path.join(dashboardRoot, "src", "data", "users.json");
  try {
    await fs.access(path.dirname(canonical));
    return canonical;
  } catch {
    return path.join(process.cwd(), "src", "data", "users.json");
  }
}

async function safeReadIfExists(filePath: string) {
  try {
    await fs.access(filePath);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function readAllUsers() {
  const filePath = await resolveDataFilePath();
  await ensureFile(filePath);
  return safeReadIfExists(filePath);
}

async function ensureFile(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

async function writeAllUsers(users: unknown[]) {
  const filePath = await resolveDataFilePath();
  await ensureFile(filePath);
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf8");
}

function normalizeEmail(email: unknown) {
  return String(email ?? "").trim().toLowerCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = normalizeEmail(searchParams.get("email"));
  const users = await readAllUsers();
  if (email) {
    const user = users.find((u: any) => normalizeEmail(u?.email) === email);
    return NextResponse.json({ user: user ?? null });
  }
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const body = (await request.json()) as any;
  const email = normalizeEmail(body?.email);
  const name = String(body?.name ?? "").trim();

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }

  const users = await readAllUsers();
  const existing = users.find((u: any) => normalizeEmail(u?.email) === email);

  const now = new Date().toISOString();
  const nextUser = {
    id: existing?.id ?? `user_${Math.random().toString(36).slice(2, 10)}`,
    email,
    name,
    phone: body?.phone ? String(body.phone) : existing?.phone,
    role: body?.role ?? existing?.role ?? "both",
    avatar: body?.avatar ?? existing?.avatar ?? "",
    isProfileComplete: Boolean(body?.isProfileComplete ?? existing?.isProfileComplete ?? false),
    verifications:
      body?.verifications ??
      existing?.verifications ?? {
        email: { status: "UNVERIFIED" },
        phone: { status: "UNVERIFIED" },
        id: { status: "UNVERIFIED" },
      },
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const next = users.filter((u: any) => decodeURIComponent(String(u?.id ?? "")).trim() !== String(nextUser.id));
  next.push(nextUser);
  await writeAllUsers(next);

  return NextResponse.json({ user: nextUser });
}

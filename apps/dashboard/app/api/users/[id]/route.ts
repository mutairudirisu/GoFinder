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

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const normalizedId = decodeURIComponent(String(id)).trim();
  const users = await readAllUsers();
  const user = users.find((u: any) => decodeURIComponent(String(u?.id ?? "")).trim() === normalizedId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const normalizedId = decodeURIComponent(String(id)).trim();
  const updates = (await request.json()) as any;
  const users = await readAllUsers();
  const index = users.findIndex((u: any) => decodeURIComponent(String(u?.id ?? "")).trim() === normalizedId);
  if (index === -1) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const updatedAt = new Date().toISOString();
  const updated = { ...users[index], ...updates, id: users[index]?.id, updatedAt };
  const next = [...users];
  next[index] = updated;
  await writeAllUsers(next);
  return NextResponse.json({ user: updated });
}

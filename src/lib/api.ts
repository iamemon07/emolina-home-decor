import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { connectDB } from "./db";
import { getSession } from "./auth";
import type { SessionPayload } from "./session";

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

function handleError(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json({ success: false, error: err.message, details: err.details }, { status: err.status });
  }
  if (err instanceof ZodError) {
    const first = err.errors[0];
    const message = first ? `${first.path.join(".") || "input"}: ${first.message}` : "Invalid input";
    return NextResponse.json(
      { success: false, error: message, details: err.flatten().fieldErrors },
      { status: 422 },
    );
  }
  if (typeof err === "object" && err && "code" in err && (err as { code: number }).code === 11000) {
    const keys = Object.keys((err as { keyValue?: object }).keyValue ?? {}).join(", ");
    return NextResponse.json(
      { success: false, error: `That ${keys || "value"} is already in use` },
      { status: 409 },
    );
  }
  console.error("[api]", err);
  return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 500 });
}

type Ctx<P> = { params: Promise<P> };

/** Public route wrapper: connects DB + uniform error handling. */
export function publicRoute<P = Record<string, string>>(fn: (req: Request, ctx: Ctx<P>) => Promise<Response>) {
  return async (req: Request, ctx: Ctx<P>) => {
    try {
      await connectDB();
      return await fn(req, ctx);
    } catch (err) {
      return handleError(err);
    }
  };
}

/** Admin route wrapper: verifies the session again (defence in depth beyond middleware). */
export function adminRoute<P = Record<string, string>>(
  fn: (req: Request, ctx: Ctx<P> & { session: SessionPayload }) => Promise<Response>,
  opts: { ownerOnly?: boolean } = {},
) {
  return async (req: Request, ctx: Ctx<P>) => {
    try {
      const session = await getSession();
      if (!session) throw new ApiError(401, "Unauthorized");
      if (opts.ownerOnly && session.role !== "owner") throw new ApiError(403, "Owner access required");
      await connectDB();
      return await fn(req, { ...ctx, session });
    } catch (err) {
      return handleError(err);
    }
  };
}

export async function readJson(req: Request) {
  try {
    return await req.json();
  } catch {
    throw new ApiError(400, "Invalid JSON body");
  }
}

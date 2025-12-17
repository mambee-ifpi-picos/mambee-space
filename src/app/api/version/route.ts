import { NextResponse } from "next/server";

export async function GET() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";
  const commitHash = process.env.NEXT_PUBLIC_GIT_COMMIT ?? "unknown";

  return NextResponse.json({
    version,
    commit: commitHash,
    timestamp: new Date().toISOString(),
  });
}

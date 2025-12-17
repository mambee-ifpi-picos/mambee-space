import { NextResponse } from "next/server";

export async function GET() {
  let version = process.env.NEXT_PUBLIC_APP_VERSION;
  let commitHash = process.env.NEXT_PUBLIC_GIT_COMMIT;

  if (!version) {
    version = process.env.npm_package_version;
  }

  if (!commitHash) {
    commitHash = process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7);
  }

  return NextResponse.json({
    version,
    lastCommit: commitHash,
    timestamp: new Date().toISOString(),
  });
}

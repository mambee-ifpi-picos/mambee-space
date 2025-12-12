import type { User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getLoggedUser } from "../supabase/getLoggedUser";

export function Auth(
  handler: (
    req: NextRequest,
    user: User | null,
  ) => Promise<Response> | Response,
  options = { required: true },
) {
  return async (req: NextRequest) => {
    const user = await getLoggedUser();
    if (options.required && !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req, user);
  };
}

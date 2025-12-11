import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnon) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: any) {
        response.cookies.set({
          name,
          value: "",
          expires: new Date(0),
          ...options,
        });
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/", "/login", "/relatorio", "/relatorioguarita"];
  const protectedRoutes = ["/reservas", "/perfil", "/reservar"];
  const adminRoutes = ["/sala_espaco", "/salas"];

  if (publicRoutes.includes(pathname)) return response;

  if (protectedRoutes.some((r) => pathname.startsWith(r))) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    return response;
  }

  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));

    const { data: usuario } = await supabase
      .from("Usuario")
      .select("admin")
      .eq("email", user.email)
      .maybeSingle();

    if (!usuario?.admin) {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/reservas/:path*",
    "/perfil/:path*",
    "/reservar/:path*",
    "/sala_espaco/:path*",
    "/salas/:path*",
    "/login",
    "/relatorio",
    "/relatorioguarita",
    "/",
  ],
};

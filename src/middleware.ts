import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const publicRoutes = ["/", "/login", "/relatorio", "/relatorioguarita"];
const protectedRoutes = ["/reservas", "/perfil", "/reservar", "/projetos"];
const adminRoutes = ["/sala_espaco", "/salas", "/cadastro_projetos"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options: CookieOptions) {
          response.cookies.set(name, value, options);
        },
        remove(name, options: CookieOptions) {
          response.cookies.set(name, "", options);
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (publicRoutes.includes(pathname)) {
    return response;
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: usuario } = await supabase.from("Usuario").select("admin").eq("idAuth", user.id).maybeSingle();

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
    "/sala_espaco/:path*",
    "/salas/:path*",
    "/projetos/:path*",
    "/cadastro_projetos/:path*",
    "/",
    "/login",
    "/relatorio",
    "/relatorioguarita",
  ],
};

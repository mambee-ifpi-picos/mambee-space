import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const publicRoutes = ["/", "/login", "/relatorio", "/relatorioguarita"];
const protectedRoutes = ["/reservas", "/perfil", "/reservar"];
const adminRoutes = ["/sala_espaco", "/salas"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createMiddlewareClient({ req: request, res: response });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ROTAS PÚBLICAS
  if (publicRoutes.includes(pathname)) {
    return response;
  }

  // ROTAS QUE EXIGEM LOGIN
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  // ROTAS DE ADMIN
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

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
    "/sala_espaco/:path*",
    "/salas/:path*",
    "/",
    "/login",
    "/relatorio",
    "/relatorioguarita",
  ],
};

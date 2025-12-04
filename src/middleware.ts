import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const publicRoutes = ["/", "/login", "/relatorio", "/relatorioguarita"];
const protectedRoutes = ["/reservas", "/perfil", "/reservar"];
const adminRoutes = ["/sala_espaco", "/salas"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (publicRoutes.includes(pathname)) {
    return supabaseResponse;
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const { data: usuario, error } = await supabase
      .from("Usuario")
      .select("admin")
      .eq("email", user.email)
      .single();

    if (error) {
      console.error("Erro ao buscar usuario admin:", error.message);
    }

    if (!usuario?.admin) {
      const url = request.nextUrl.clone();
      url.pathname = "403";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  return supabaseResponse;
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

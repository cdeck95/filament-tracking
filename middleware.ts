import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request: NextRequest) {
  // Ignore requests to the no-organization page
  if (
    request.nextUrl.pathname === "/no-organization" ||
    request.nextUrl.pathname === "/no-roles"
  ) {
    return NextResponse.next();
  }

  const { getAccessToken, isAuthenticated, getOrganization } =
    getKindeServerSession();

  const isAuth = await isAuthenticated();

  // If not authenticated, redirect to login page
  if (!isAuth && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const accessToken = await getAccessToken();
  const organization = await getOrganization();

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

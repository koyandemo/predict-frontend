import { withAuth } from "next-auth/middleware";
import { NextRequest} from "next/server";

const PROTECTED_ROUTES = ["/profile"];

const authMiddleware = withAuth(() => undefined, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/login",
  },
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(pathname,"17")
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return;
  }

  // ✅ pass BOTH arguments
  return (authMiddleware as any)(req);
}

export const config = {
  matcher: ["/profile/:path*"],
};

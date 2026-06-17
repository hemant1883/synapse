import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ["/", "/login", "/register", "/demo"]
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for session token
  const token = request.cookies.get("session")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    const user = payload.user as { role: string }

    // Role-based routing
    if (pathname.startsWith("/admin") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    if (pathname.startsWith("/teacher") && user.role !== "teacher") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    if (pathname.startsWith("/student") && user.role !== "student") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

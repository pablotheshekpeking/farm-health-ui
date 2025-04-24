import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If the user is not logged in and trying to access a protected route,
    // they will be redirected to the login page automatically by NextAuth
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/animals/:path*",
    "/reports/:path*",
    "/settings/:path*",
    // Add any other protected routes here
  ],
} 
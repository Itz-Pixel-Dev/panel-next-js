import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { authenticated: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        authenticated: true, 
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { authenticated: false, message: "Authentication check failed" },
      { status: 500 }
    );
  }
} 
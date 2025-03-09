import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // In a real application, you would validate the token against your database
    // For demo purposes, we'll just consider any token valid
    // You could implement something like:
    /*
    const resetToken = await db.passwordResetTokens.findUnique({
      where: {
        token,
        expires: { gt: new Date() }
      }
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }
    */

    // For demo purposes, consider any token valid if it's longer than 10 characters
    if (token.length < 10) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        valid: true,
        message: "Token is valid"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password complexity
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one lowercase letter, one uppercase letter, and one number" },
        { status: 400 }
      );
    }

    // In a real application, you would validate the token and get the user
    // For demo purposes, we'll assume the token is valid and return success
    
    /*
    // Find token in database
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

    // Find user
    const user = await db.users.findUnique({
      where: { id: resetToken.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12);

    // Update user's password
    await db.users.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // Delete the used token
    await db.passwordResetTokens.delete({
      where: { id: resetToken.id }
    });
    */

    // For demo, just return success
    return NextResponse.json(
      { 
        success: true,
        message: "Password has been reset successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
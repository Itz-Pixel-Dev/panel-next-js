import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

// Generate a random token for password reset
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.users.findUnique({
      where: { email }
    });

    // For security reasons, don't disclose whether the email exists
    if (!user) {
      return NextResponse.json(
        { success: true, message: "If an account with that email exists, a password reset link has been sent." },
        { status: 200 }
      );
    }

    // Generate token with 1-hour expiry
    const token = generateToken();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Store the token in the database
    // Note: In a real implementation, you would have a passwordResetTokens table
    // For this demo, we'll just return the token and expiry
    
    // In a real implementation, you would send an email with the reset link
    // For demo purposes, we'll just return success
    // The reset link would be something like: https://yourapp.com/auth/reset-password?token=GENERATED_TOKEN

    return NextResponse.json(
      { 
        success: true, 
        message: "Password reset link sent", 
        // These would normally be sent only in an email, not returned in the response
        debug: { 
          token,
          resetLink: `${process.env.NEXT_PUBLIC_APP_URL || ""}/auth/reset-password?token=${token}`,
          expires
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
import { auth0 } from "@/lib/auth0";
import { NextResponse, NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    // Get the session from Auth0
    const session = await auth0.getSession();

    console.log("Full session object:", JSON.stringify(session, null, 2));

    if (!session) {
      return NextResponse.json({
        error: "No session found. User may not be logged in.",
      }, { status: 401 });
    }

    // The access token should be in session.accessToken or session.tokenSet.accessToken
    const accessToken = session.accessToken || session.tokenSet?.accessToken;

    console.log("Access token found:", accessToken ? `${accessToken.substring(0, 50)}...` : "null");

    if (!accessToken) {
      // The token might be the encrypted session token, not the API access token
      // This happens when AUTH0_AUDIENCE is not properly configured
      return NextResponse.json({
        error: "No API access token available",
        details: "The session contains an encrypted token, not a JWT. Ensure AUTH0_AUDIENCE is set to your API identifier.",
        session: {
          hasSession: !!session,
          hasTokenSet: !!session.tokenSet,
          tokenKeys: session.tokenSet ? Object.keys(session.tokenSet) : []
        }
      }, { status: 401 });
    }

    // Check if the token is a JWT (starts with eyJ) or encrypted (starts with eyJh)
    if (accessToken.startsWith("eyJhbGciOiJkaXIi")) {
      return NextResponse.json({
        error: "Token is encrypted (JWE), not a JWT",
        details: "The token is a session token, not an API access token. Check Auth0 API configuration.",
        tokenType: "JWE (encrypted session token)"
      }, { status: 401 });
    }

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error getting access token:", error);
    return NextResponse.json({
      error: "Failed to get access token",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
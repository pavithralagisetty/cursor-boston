import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/server-auth";
import { getAgentsByOwner } from "@/lib/agents";

/**
 * GET /api/agents/user
 * Get all agents owned by the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user is logged in
    let user;
    try {
      user = await getVerifiedUser(request);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    // Fetch agents owned by this user
    const agents = await getAgentsByOwner(user.uid);

    return NextResponse.json({
      success: true,
      agents: agents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        avatarUrl: agent.avatarUrl,
        status: agent.status,
        claimedAt: agent.claimedAt,
        lastActiveAt: agent.lastActiveAt,
        visibility: agent.visibility,
      })),
    });
  } catch (error) {
    console.error("Error fetching user agents:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch agents",
      },
      { status: 500 }
    );
  }
}

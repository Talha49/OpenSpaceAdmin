import dbConnect from "@/lib/connectdb/connection";
import Role from "@/lib/models/Role";
import User from "@/lib/models/User";
import Group from "@/lib/models/Group";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    // Fetch all roles
    const roles = await Role.find();

    // Fetch users and groups for each role
    const rolesWithDetails = await Promise.all(
      roles.map(async (role) => {
        const users = await User.find({ role: role._id }); // Match users with the role ID
        const groups = await Group.find({ role: role._id }); // Match groups with the role ID
        return ({
          ...role.toObject(),
          allotedUsers: users,
          allotedGroups: groups,
        });
      })
    );

    return NextResponse.json(rolesWithDetails);
  } catch (error) {
    console.error("Error fetching roles, users, and groups: ", error.message);
    return NextResponse.json(
      { error: "An error occurred while fetching roles, users, and groups" },
      { status: 500 }
    );
  }
}

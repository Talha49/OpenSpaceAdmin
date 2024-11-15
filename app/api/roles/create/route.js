import { NextResponse } from "next/server";
import Role from "@/lib/models/Role";
import dbConnect from "@/lib/connectdb/connection";

export async function POST(req) {
  try {
    await dbConnect();
    const { roleName, roleDescription, permissions, createdBy } =
      await req.json();

    // Validate required fields
    if (!roleName || !roleDescription || !permissions || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new role with the `created` field populated
    const newRole = new Role({
      roleName: roleName,
      roleDescription: roleDescription,
      permissions: permissions,
      created: {
        by: createdBy, // User who created the role
        at: new Date(), // Optional, defaults to current time
      },
    });

    // Save the new role
    await newRole.save();

    return NextResponse.json(
      {
        message: "Role created successfully",
        role: newRole,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error occurred while creating role: ", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import dbConnect from "@/lib/connectdb/connection";
import Role from "@/lib/models/Role";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // Check if the role exists
    const existingRole = await Role.findById(id); // Correctly find the role by ID
    if (!existingRole) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    // Delete the role
    await Role.findByIdAndDelete(id);

    // Update users who have this role to set their role to null
    await User.updateMany({ role: id }, { $set: { role: null } });

    return NextResponse.json(
      { message: "Role deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting role =>", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

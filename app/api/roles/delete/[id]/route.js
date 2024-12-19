import dbConnect from "@/lib/connectdb/connection";
import Role from "@/lib/models/Role";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // Check if the role exists
    const existing = await Role.findById(id); // Correctly find the role by ID
    if (!existing) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    // Delete the role
    await Role.findByIdAndDelete(id);

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

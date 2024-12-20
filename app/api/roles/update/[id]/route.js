import dbConnect from "@/lib/connectdb/connection";
import Group from "@/lib/models/Group";
import Role from "@/lib/models/Role";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { name, description, permissions, allotedUsers, allotedGroups } =
      await req.json();

    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    existingRole.name = name || existingRole.name;
    existingRole.description = description || existingRole.description;
    existingRole.permissions = permissions || existingRole.permissions;

    await existingRole.save();

    // Update all the users in `allotedUsers` to reference the new role
    const updatedUsers = await User.updateMany(
      { _id: { $in: allotedUsers } },
      { $set: { role: existingRole._id } }
    );

    // Update all the groups in `allotedGroups` to reference the new role
    const updatedGroups = await Group.updateMany(
      { _id: { $in: allotedGroups } },
      { $set: { role: existingRole._id } }
    );

    // Now, update the users in each group in `allotedGroups` (group members)
    for (const groupId of allotedGroups) {
      // Fetch the group by its ID
      const group = await Group.findById(groupId);
      if (group) {
        // Combine groupOwnerID and groupTargetID arrays
        const groupMembers = [...group.groupTargetID];
        // Update the users in this group with the new role
        await User.updateMany(
          { _id: { $in: groupMembers } },
          { $set: { role: existingRole._id } }
        );
      }
    }

    return NextResponse.json(
      { message: "Role updated successfully", role: existingRole },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating role =>", error);
    return NextResponse.json(
      { message: "Error updating role" },
      { status: 500 }
    );
  }
}

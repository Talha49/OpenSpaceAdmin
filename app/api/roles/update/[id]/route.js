import dbConnect from "@/lib/connectdb/connection";
import Group from "@/lib/models/Group";
import Role from "@/lib/models/Role";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params; // Role ID
    const { name, description, permissions, allotedUsers, allotedGroups } =
      await req.json();

    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    // Update role details
    existingRole.name = name || existingRole.name;
    existingRole.description = description || existingRole.description;
    existingRole.permissions = permissions || existingRole.permissions;
    await existingRole.save();

    // Find all users with the given role ID
    const usersWithRole = await User.find({ role: id });

    // Identify users who need their role set to null (not in allotedUsers)
    const usersToUnsetRole = usersWithRole.filter(
      (user) => !allotedUsers.includes(user._id.toString())
    );

    // Update users to remove the role
    await User.updateMany(
      { _id: { $in: usersToUnsetRole.map((user) => user._id) } },
      { $set: { role: null } }
    );

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
      const group = await Group.findById(groupId);
      if (group) {
        const groupMembers = [...group.groupTargetID];
        await User.updateMany(
          { _id: { $in: groupMembers } },
          { $set: { role: existingRole._id } }
        );
      }
    }

    const users = await User.find({ role: existingRole._id }); // Match users with the role ID
    const groups = await Group.find({ role: existingRole._id }); // Match groups with the role ID

    return NextResponse.json({
      ...existingRole.toObject(),
      allotedUsers: users,
      allotedGroups: groups,
    });
  } catch (error) {
    console.log("Error updating role =>", error);
    return NextResponse.json(
      { message: "Error updating role" },
      { status: 500 }
    );
  }
}

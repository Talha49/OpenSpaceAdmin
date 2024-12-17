import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb/connection";
import Role from "@/lib/models/Role";
import User from "@/lib/models/User";
import Group from "@/lib/models/Group";

export async function POST(req) {
  try {
    await dbConnect();
    const {
      name,
      description,
      menuPermissions,
      formPermissions,
      reportPermissions,
      workflowPermissions,
      allotedUsers,
      allotedGroups,
      createdBy,
    } = await req.json();

    // Check for missing fields
    if (
      !name ||
      !description ||
      !menuPermissions ||
      !formPermissions ||
      !reportPermissions ||
      !workflowPermissions ||
      !createdBy
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the new role
    const newRole = new Role({
      name,
      description,
      permissions: {
        menuPermissions,
        formPermissions,
        reportPermissions,
        workflowPermissions,
      },
      created: {
        by: createdBy,
      },
    });

    // Save the role to the database
    await newRole.save();

    // Update all the users in `allotedUsers` to reference the new role
    const updatedUsers = await User.updateMany(
      { _id: { $in: allotedUsers } },
      { $set: { role: newRole._id } }
    );

    // Update all the groups in `allotedGroups` to reference the new role
    const updatedGroups = await Group.updateMany(
      { _id: { $in: allotedGroups } },
      { $set: { role: newRole._id } }
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
          { $set: { role: newRole._id } }
        );
      }
    }

    return NextResponse.json({
      message: "Role created and allocated successfully",
      status: "success",
      role: newRole,
      updatedUsers: updatedUsers.modifiedCount,
      updatedGroups: updatedGroups.modifiedCount,
    });
  } catch (error) {
    console.log("Error Creating Role =>", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

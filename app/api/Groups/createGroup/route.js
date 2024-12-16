import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb/connection";
import Group from "@/lib/models/Group";

export async function POST(req) {
  console.log("API: Received POST request for group creation");

  try {
    await dbConnect();
    console.log("API: Connected to MongoDB");

    const groupData = await req.json();
    console.log("API: Received data:", groupData);

    // Destructure to extract values, including groupType
    const { groupType, basics, owners, members } = groupData;

    // Validate incoming data
    if (!owners || owners.length === 0) {
      throw new Error("At least one owner is required.");
    }
    if (!members || members.length < 2) {
      throw new Error("At least two members are required.");
    }
    if (!basics || !basics.name || !basics.description) {
      throw new Error("Group name and description are required.");
    }

    // Map data to required fields
    const groupOwrnerID = owners.map((owner) => owner._id); // Extract owner IDs
    const groupTargetID = members.map((member) => member._id); // Extract member IDs

    const newGroup = await Group.create({
      groupName: basics.name,
      groupType: groupType,  // Now groupType is properly passed
      groupDescription: basics.description,
      status: "active",
      created: {
        by: "admin", // Replace with dynamic user info if needed
        createdAt: new Date(),
      },
      groupOwrnerID,
      groupTargetID,
    });

    console.log("API: Group successfully created:", newGroup);
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("API: Error creating group:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb/connection";
import Group from "@/lib/models/Group";

export async function GET(req) {
  console.log("API: Received GET request for fetching groups");

  try {
    await dbConnect();
    console.log("API: Connected to MongoDB");

    // Fetch groups and populate owners and members
    const groups = await Group.find({ status: "active" }) // Fetch only active groups
      .populate("groupOwrnerID", "fullName email") // Populate owners (select only fullName and email fields)
      .populate("groupTargetID", "fullName email"); // Populate members (select only fullName and email fields)

    // Log the fetched groups before returning
    console.log("API: Groups fetched and populated:", JSON.stringify(groups, null, 2));

    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error("API: Error fetching groups:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

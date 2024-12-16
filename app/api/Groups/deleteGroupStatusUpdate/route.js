import dbConnect from "../../../../lib/connectdb/connection"; // Assuming you have a dbConnect helper for MongoDB connection
import Group from "../../../../lib/models/Group"; // Group model

// Handle the PUT request
export async function PUT(req) {
  const { groupId, groupName, groupDescription, groupOwrnerID, groupTargetID, status } = await req.json();

  console.log("Received PUT request to update group with ID:", groupId);
  console.log("Request body:", { groupName, groupDescription, groupOwrnerID, groupTargetID, status });

  if (!groupId) {
    console.log("Group ID is missing in the request body.");
    return new Response(
      JSON.stringify({ message: "Group ID is required" }),
      { status: 400 }
    );
  }

  try {
    console.log("Connecting to the database...");
    await dbConnect();

    console.log("Updating group in the database...");
    // Update group in the database, including the status
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        groupName,
        groupDescription,
        groupOwrnerID,
        groupTargetID,
        status, // Update the status field
      },
      { new: true } // Return the updated document
    );

    if (!updatedGroup) {
      console.log("Group with ID:", groupId, "was not found.");
      return new Response(
        JSON.stringify({ message: "Group not found" }),
        { status: 404 }
      );
    }

    console.log("Group updated successfully:", updatedGroup);
    return new Response(JSON.stringify(updatedGroup), { status: 200 });
  } catch (error) {
    console.log("Error occurred while updating group:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
}

// Handle other HTTP methods (if needed)
export async function GET() {
  console.log("Received unsupported GET request on update endpoint.");
  return new Response(
    JSON.stringify({ message: "Method Not Allowed" }),
    { status: 405 }
  );
}

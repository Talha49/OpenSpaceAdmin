import dbConnect from "@/lib/connectdb/connection"; // Fix the import to use dbConnect
import Group from "@/lib/models/Group"; // Assuming you have a Mongoose model for the Group

export async function GET(req) {
  try {
    // Connect to MongoDB with Mongoose
    await dbConnect();

    // Fetch groups with 'inactive' status
    const deletedGroups = await Group.find({ status: "inactive" })
      .populate("groupOwrnerID", "fullName email image") // Populate owners (select only fullName and email fields)
      .populate("groupTargetID", "fullName email image"); // Populate members (select only fullName and email fields)
    // Return deleted groups as JSON
    return new Response(JSON.stringify(deletedGroups), { status: 200 });
  } catch (error) {
    console.error("Error fetching deleted groups:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch deleted groups" }),
      { status: 500 }
    );
  }
}

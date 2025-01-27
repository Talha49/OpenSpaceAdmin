import dbConnect from "@/lib/connectdb/connection";
import User from "@/lib/models/User";

export async function POST(req) {
  try {
   
    // Parse the JSON body from the request
    const body = await req.json();
    
    const {
      _id, // Unique user ID
      fullName,
      address,
      city,
      image: uploadedImage,
      multifactorAuthentication,
      contact, // Include contact field
    } = body;

    // Ensure user ID is provided
    if (!_id) {
     
      return new Response(
        JSON.stringify({ message: "User ID is required" }),
        { status: 400 }
      );
    }

  
    await dbConnect(); // Establish database connection

    let imageUrl = uploadedImage || null; // Use uploaded image if provided

    
    // Construct the updated fields dynamically
    const updatedFields = {
      ...(fullName && { fullName }),
      ...(address && { address }),
      ...(city && { city }),
      ...(contact && { contact }), // Dynamically update contact if provided
      ...(uploadedImage && { image: uploadedImage }), // Update image URL if provided
      ...(multifactorAuthentication !== undefined && {
        multifactorAuthentication,
      }),
    };

   

    // Update the user in the database
    const updatedUser = await User.findOneAndUpdate(
      { _id }, // Match user by ID
      { $set: updatedFields }, // Update fields dynamically
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      console.warn("User not found for the given ID");
      return new Response(
        JSON.stringify({ message: "User not found." }),
        { status: 404 }
      );
    }

    console.log("User updated successfully:", updatedUser);

    return new Response(
      JSON.stringify({ message: "User updated successfully.", user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({
        message: "An error occurred. Please try again later.",
      }),
      { status: 500 }
    );
  }
}

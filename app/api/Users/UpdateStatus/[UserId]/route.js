// app/api/Users/UpdateStatus/[UserId]/route.js

import dbConnect from '../../../../../lib/connectdb/connection'; // Path to your connection.js
import User from '../../../../../lib/models/User'; // User model
import mongoose from 'mongoose';

export async function PUT(req, { params }) {
  const { UserId } = params; // Extract userId from the URL parameter
  const { status } = await req.json(); // Extract status from the request body

  // Validate if the UserId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(UserId)) {
    return new Response(
      JSON.stringify({ message: 'Invalid user ID format' }),
      { status: 400 }
    );
  }

  try {
    // Connect to the MongoDB database
    await dbConnect();

    // Find the user by UserId
    const user = await User.findById(UserId);
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    // Update the user's status
    const updatedUser = await User.findByIdAndUpdate(
      UserId,
      { status }, // Update status field
      { new: true } // Return the updated user document
    );

    return new Response(
      JSON.stringify(updatedUser),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating status:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

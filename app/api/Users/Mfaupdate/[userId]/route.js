import dbConnect from '../../../../../lib/connectdb/connection'; // Path to your connection.js
import User from '../../../../../lib/models/User'; // User model
import mongoose from 'mongoose';

export async function PUT(req, { params }) {
  const { userId } = params;  // Extract userId from the URL parameter
  const { multifactorAuthentication } = await req.json();  // Extract MFA status from the request body

  // Validate if the userId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return new Response(JSON.stringify({ message: 'Invalid user ID format' }), { status: 400 });
  }

  try {
    // Connect to the MongoDB database
    await dbConnect();

    // Log the current value of multifactorAuthentication for debugging
    const user = await User.findById(userId);
    console.log('Current MFA status:', user ? user.multifactorAuthentication : 'User not found');
    
    // Update MFA status if it's different from the current one
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { multifactorAuthentication },  // Update MFA status (true or false)
      { new: true }  // Return the updated user document
    );

    // If user is not found, return 404
    if (!updatedUser) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Return the updated user
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error('Error updating MFA status:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

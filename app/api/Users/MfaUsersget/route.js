// /app/api/Users/MfaUsersget/route.js (or wherever your route is located)
import dbConnect from '../../../../lib/connectdb/connection';  // Connection file
import User from '../../../../lib/models/User';  // User model

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch users with either MFA status as true or false
    const users = await User.find({
      multifactorAuthentication: { $in: [true, false] },
    });

    // Return the list of users as JSON
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return a 500 status with an error message
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

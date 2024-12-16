import dbConnect from '@/lib/connectdb/connection';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('📩 Received POST request to delete users');

    // Parse the request body
    const requestBody = await request.json();
    console.log('📦 Full request body:', requestBody);

    // Validate that `users` is present and extract `userIds`
    if (!requestBody || !requestBody.users) {
      console.error('❌ "users" array is missing in the request body');
      return NextResponse.json({ error: '"users" array is required in the request body' }, { status: 400 });
    }

    const userIds = requestBody.users.map((user) => user._id);
    console.log('📦 Extracted user IDs to delete:', userIds);

    // Connect to the database
    await dbConnect();

    // Update the `status` of the users to "inactive"
    const result = await User.updateMany(
      { _id: { $in: userIds } }, // Match users by IDs
      { $set: { status: 'inactive' } } // Set status to "inactive"
    );

    // Log the correct count of modified users
    console.log(`✅ ${result.modifiedCount || result.nModified} user(s) status updated to "inactive"`);

    if ((result.modifiedCount || result.nModified) === 0) {
      return NextResponse.json({ message: 'No users found or already inactive' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Users marked as inactive successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error handling request:', error);
    return NextResponse.json({ error: 'Error handling request' }, { status: 500 });
  }
}

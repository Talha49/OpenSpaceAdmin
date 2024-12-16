// app/api/Groups/deleteGroups/route.js

import connectDb from '@/lib/connectdb/connection';  // Assuming you have a connection utility
import Group from '@/lib/models/Group';  // Assuming you have a Group model

// Handle POST request for updating the group status to "inactive"
export async function POST(req) {
  try {
    // Get data from request body
    const { ids } = await req.json(); // Expecting 'ids' instead of 'groupIds'

    if (!ids || ids.length === 0) {
      return new Response(JSON.stringify({ message: 'No group IDs provided' }), { status: 400 });
    }

    // Connect to the database
    await connectDb();

    // Update groups' status to 'inactive'
    const result = await Group.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 'inactive' } }
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ message: 'No groups were updated' }), { status: 404 });
    }

    // Return success response
    return new Response(
      JSON.stringify({ message: 'Groups successfully marked as inactive', groupIds: ids }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating groups:', error);
    return new Response(JSON.stringify({ message: 'Error updating groups' }), { status: 500 });
  }
}

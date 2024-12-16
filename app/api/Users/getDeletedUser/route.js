import dbConnect from '@/lib/connectdb/connection';
import User from '@/lib/models/User';

export async function GET() {
  try {
    console.log('📥 Received request to fetch inactive users');

    // Connect to the database
    console.log('⚙️ Connecting to the database...');
    await dbConnect();
    console.log('✅ Database connected successfully.');

    // Fetch inactive users from the User collection
    console.log('🔍 Querying inactive users...');
    const inactiveUsers = await User.find({ status: 'inactive' });
    console.log(`🛠️ Query Result: Found ${inactiveUsers.length} inactive user(s).`);

    // Return the users as JSON
    return new Response(JSON.stringify(inactiveUsers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error fetching inactive users:', error);

    // Return error response
    return new Response(JSON.stringify({ error: 'Failed to fetch inactive users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

import dbConnect from '@/lib/connectdb/connection'; // Database connection utility
import User from '@/lib/models/User'; // User model
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔄 Connecting to database...');
    await dbConnect();

    console.log('📦 Fetching active users from the database...');
    const activeUsers = await User.find({ status: 'active' }); // Fetch users with status 'active'

    console.log('✅ Active users fetched successfully:', activeUsers);

    return NextResponse.json(activeUsers, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching active users:', error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}

import dbConnect from '@/lib/connectdb/connection'; // Adjust import based on your project structure
import User from '@/lib/models/User'; // Adjust the import based on your project structure
import Group from '@/lib/models/Group'; // Adjust the import based on your project structure
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Extract userId from the query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    // Check if userId is provided
    if (!userId) {
      console.log("❌ Error: userId is required");
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    console.log('🔄 Connecting to database...');
    await dbConnect();

    console.log(`📦 Fetching user details for userId: ${userId}`);
    // Fetch user details by userId
    const user = await User.findById(userId);
    if (!user) {
      console.log(`❌ Error: User with id ${userId} not found`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ User fetched successfully:', user);

    // Fetch all groups and populate relevant user fields (groupOwrnerID and groupTargetID)
    console.log(`📦 Fetching all groups`);
    const groups = await Group.find()
      .populate('groupOwrnerID', 'fullName email')   // Populate owners with fullName and email
      .populate('groupTargetID', 'fullName email');   // Populate targets with fullName and email

    // If no groups found, log the issue and return
    if (!groups || groups.length === 0) {
      console.log('❌ Error: No groups found');
      return NextResponse.json({ error: 'No groups found' }, { status: 404 });
    }

    console.log('✅ Groups fetched successfully:', groups);

    // Separate groups into "partOf" and "notPartOf"
    const userGroups = {
      partOf: [],
      notPartOf: []
    };

    groups.forEach(group => {
      // Log the group object to see all details
      console.log('Full Group details:', group);

      // Ensure groupOwnerID and groupTargetID exist
      const groupOwners = group.groupOwrnerID || [];
      const groupMembers = group.groupTargetID || [];

      console.log('Group Owners (groupOwrnerID):', groupOwners);
      console.log('Group Members (groupTargetID):', groupMembers);

      // Check if user is an owner or member
      const isOwner = groupOwners.some(owner => owner._id.toString() === userId);
      const isMember = groupMembers.some(member => member._id.toString() === userId);

      // If the user is part of the group (either as an owner or a target/member)
      if (isOwner || isMember) {
        console.log(`User ${userId} is part of group ${group.groupName}`);
        userGroups.partOf.push(group);  // User is part of this group
      } else {
        console.log(`User ${userId} is NOT part of group ${group.groupName}`);
        userGroups.notPartOf.push(group);  // User is not part of this group
      }
    });

    // Debug log for userGroups
    console.log('🧑‍🤝‍🧑 Groups the user is part of:', userGroups.partOf);
    console.log('🚫 Groups the user is NOT part of:', userGroups.notPartOf);

    // Return both user details and groups data
    return NextResponse.json({
      user,
      groups,
      userGroups,
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching user and group details:', error);
    return NextResponse.json({ error: 'Error fetching user and group details' }, { status: 500 });
  }
}

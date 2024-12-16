import dbConnect from '../../../../../lib/connectdb/connection';
import Group from '../../../../../lib/models/Group';
import User from '../../../../../lib/models/User';

export async function POST(req) {
  try {
    await dbConnect();

    const { userId, groupId, role } = await req.json();
    console.log('Received userId:', userId);
    console.log('Received groupId:', groupId);
    console.log('Received role:', role);

    // Ensure the groupId is a string if it's an object
    const groupIdString = typeof groupId === 'object' ? groupId._id : groupId;

    // Fetch the user to ensure they exist
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Fetch the group to ensure it exists
    const group = await Group.findById(groupIdString);
    if (!group) {
      console.error('Group not found:', groupIdString);
      return new Response(JSON.stringify({ error: 'Group not found' }), { status: 404 });
    }

    // Initialize arrays if not already initialized
    group.groupOwrnerID = group.groupOwrnerID || [];
    group.groupTargetID = group.groupTargetID || [];

    // Check role and update the group arrays accordingly
    if (role === 'owner') {
      if (!group.groupOwrnerID.includes(userId)) {
        group.groupOwrnerID.push(userId); // Add user to the owners list
      }
    } else if (role === 'member') {
      if (!group.groupTargetID.includes(userId)) {
        group.groupTargetID.push(userId); // Add user to the members list
      }
    } else {
      return new Response(JSON.stringify({ error: 'Invalid role' }), { status: 400 });
    }

    // Ensure the user's groups array is initialized to an empty array if it doesn't exist
    user.groups = user.groups || [];

    // Add the group to the user's group list
    if (!user.groups.includes(groupIdString)) {
      user.groups.push(groupIdString);
    }

    // Save the updated group and user
    await group.save();
    await user.save();

    console.log('User added to group successfully');
    return new Response(JSON.stringify({ success: true, message: 'User added to group' }), { status: 200 });

  } catch (error) {
    console.error('Error during add user process:', error);
    return new Response(JSON.stringify({ error: 'An error occurred during the add user process' }), { status: 500 });
  }
}

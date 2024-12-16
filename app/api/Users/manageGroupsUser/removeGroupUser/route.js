// pages/api/users/removeGroup.js

import dbConnect from '../../../../../lib/connectdb/connection';
import Group from '../../../../../lib/models/Group';
import User from '../../../../../lib/models/User';
export async function POST(req) {
  try {
    await dbConnect();

    const { userId, groupId } = await req.json();
    console.log('Received userId:', userId);
    console.log('Received groupId:', groupId);

    // Fetch the user to ensure they exist
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    console.log('User found:', user);

    // Remove the group from the user's groups array
    user.groups = user.groups || [];
    console.log('User groups before removal:', user.groups);

    user.groups = user.groups.filter((id) => id.toString() !== groupId);
    console.log('User groups after removal:', user.groups);

    await user.save();

    // Fetch the group to ensure it exists
    const group = await Group.findById(groupId);
    if (!group) {
      console.error('Group not found:', groupId);
      return new Response(JSON.stringify({ error: 'Group not found' }), { status: 404 });
    }

    console.log('Group found:', group);

    // Check if groupTargetID and groupOwnerID are defined before filtering
    group.groupTargetID = Array.isArray(group.groupTargetID) ? group.groupTargetID.filter((id) => id.toString() !== userId) : [];
    console.log('Group members after removal:', group.groupTargetID);

    group.groupOwrnerID = Array.isArray(group.groupOwrnerID) ? group.groupOwrnerID.filter((id) => id.toString() !== userId) : [];
    console.log('Group owners after removal:', group.groupOwrnerID);

    await group.save();
    console.log('Group updated successfully');

    return new Response(JSON.stringify({ success: true, message: 'User removed from group' }), { status: 200 });
  } catch (error) {
    console.error('Error during removal process:', error);
    return new Response(JSON.stringify({ error: 'An error occurred during the removal process' }), { status: 500 });
  }
}
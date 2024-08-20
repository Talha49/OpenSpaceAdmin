// /api/deleteUser.js
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    const data = await request.json();
    const { id, ids } = data;

    if (!id && (!ids || !Array.isArray(ids))) {
      return NextResponse.json({ error: 'Invalid request. Provide either id or ids array.' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'data');
    const usersFilePath = path.join(dataDir, 'users.json');
    const groupsFilePath = path.join(dataDir, 'groups.json');

    // Ensure the data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read the existing user data
    let existingUsers = [];
    if (fs.existsSync(usersFilePath)) {
      const fileContents = fs.readFileSync(usersFilePath, 'utf8');
      existingUsers = JSON.parse(fileContents);
    }

    // Read the existing group data
    let existingGroups = [];
    if (fs.existsSync(groupsFilePath)) {
      const fileContents = fs.readFileSync(groupsFilePath, 'utf8');
      existingGroups = JSON.parse(fileContents);
    }

    let userIdsToDelete = [];

    if (id) {
      // Single user deletion
      userIdsToDelete = [id];
      existingUsers = existingUsers.filter(user => user.id !== id);
    } else {
      // Bulk deletion
      userIdsToDelete = ids;
      existingUsers = existingUsers.filter(user => !ids.includes(user.id));
    }

    // Update the groups by removing the deleted users from owners and members
    const updatedGroups = existingGroups.map(group => {
      const updatedOwners = group.owners.filter(owner => !userIdsToDelete.includes(owner.id));
      const updatedMembers = group.members.filter(member => !userIdsToDelete.includes(member.id));

      return {
        ...group,
        owners: updatedOwners,
        members: updatedMembers,
      };
    });

    // Write the updated users back to the users.json file
    fs.writeFileSync(usersFilePath, JSON.stringify(existingUsers, null, 2), 'utf8');

    // Write the updated groups back to the groups.json file
    fs.writeFileSync(groupsFilePath, JSON.stringify(updatedGroups, null, 2), 'utf8');

    return NextResponse.json({ message: 'User(s) and related group data deleted successfully' });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Error handling request' }, { status: 500 });
  }
}

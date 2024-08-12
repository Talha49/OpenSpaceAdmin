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
    const filePath = path.join(dataDir, 'users.json');

    // Ensure the data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read the existing data
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContents);
    }

    let updatedData;
    if (id) {
      // Single user deletion
      updatedData = existingData.filter(user => user.id !== id);
    } else {
      // Bulk deletion
      updatedData = existingData.filter(user => !ids.includes(user.id));
    }

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');

    return NextResponse.json({ message: 'User(s) deleted successfully' });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Error handling request' }, { status: 500 });
  }
}
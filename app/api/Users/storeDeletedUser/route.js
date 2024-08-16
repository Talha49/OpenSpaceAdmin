// /api/storeDeletedUser.js
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { users } = await request.json();

    const dataDir = path.join(process.cwd(), 'datatwo');
    const filePath = path.join(dataDir, 'deletedUsers.json');

    // Ensure the data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing deleted users
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContents);
    }

    // Add new deleted users
    const updatedData = [...existingData, ...users];

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');

    return NextResponse.json({ message: 'Deleted users stored successfully' });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Error handling request' }, { status: 500 });
  }
}
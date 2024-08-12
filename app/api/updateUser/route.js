import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updatedUserData } = data;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
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

    // Update the user data with the specified ID
    const userIndex = existingData.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    existingData[userIndex] = { ...existingData[userIndex], ...updatedUserData };

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');

    return NextResponse.json({ message: 'User updated successfully', user: existingData[userIndex] });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Error handling request' }, { status: 500 });
  }
}

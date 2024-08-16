import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Received data:', data); // Log received data

    // Assign a unique UUID to the new user
    const userWithId = { ...data, id: uuidv4() };
    console.log('User with UUID:', userWithId); // Log user with UUID

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'users.json');
    console.log('File path:', filePath); // Log file path

    // Ensure the data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read the existing data
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      console.log('Existing file contents:', fileContents); // Log existing file contents
      existingData = JSON.parse(fileContents);
    }

    // Add the new user with UUID
    existingData.push(userWithId);

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');
    console.log('Data written to file:', existingData); // Log data written to file

    return NextResponse.json({ message: 'User saved successfully', user: userWithId });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Error handling request' }, { status: 500 });
  }
}

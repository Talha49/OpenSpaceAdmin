// api/Groups/storeDeletedGroups.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const deletedGroups = await req.json();

    // Set the path for the new JSON file
    const dataDir = path.join(process.cwd(), 'datatwo');
    const filePath = path.join(dataDir, 'deletedGroups.json');

    // Ensure the directory exists before writing the file
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    let storedDeletedGroups = [];
    
    // If the file already exists, read its contents
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      storedDeletedGroups = JSON.parse(fileContents);
    }

    // Add the new deleted groups to the existing ones
    storedDeletedGroups = [...storedDeletedGroups, ...deletedGroups];

    // Write the updated list of deleted groups to the file
    fs.writeFileSync(filePath, JSON.stringify(storedDeletedGroups, null, 2));

    return NextResponse.json({ message: 'Deleted groups stored successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error storing deleted groups:', error);
    return NextResponse.json({ error: 'Failed to store deleted groups' }, { status: 500 });
  }
}

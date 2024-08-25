
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'datatwo');
    const filePath = path.join(dataDir, 'deletedGroups.json');

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const deletedGroups = JSON.parse(fileContents);

      // Return the deleted groups data
      return NextResponse.json({ deletedGroups }, { status: 200 });
    } else {
      // If the file doesn't exist, return an empty array
      return NextResponse.json({ deletedGroups: [] }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching deleted groups:', error);
    return NextResponse.json({ error: 'Error fetching deleted groups' }, { status: 500 });
  }
}

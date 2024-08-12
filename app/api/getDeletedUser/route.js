// /api/getDeletedUsers.js
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'datatwo');
    const filePath = path.join(dataDir, 'deletedUsers.json');

    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const deletedUsers = JSON.parse(fileContents);
      return NextResponse.json(deletedUsers);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Error handling request' }, { status: 500 });
  }
}
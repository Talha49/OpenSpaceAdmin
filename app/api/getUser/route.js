import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'users.json');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json([], { status: 200 });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(fileContents);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}

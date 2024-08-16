import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const group = await req.json();
    const filePath = path.join(process.cwd(), 'DataGroup', 'groups.json');
    
    let groups = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      groups = JSON.parse(fileContents);
    }

    const newGroup = { ...group, id: uuidv4() };
    groups.push(newGroup);

    fs.writeFileSync(filePath, JSON.stringify(groups, null, 2));

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}
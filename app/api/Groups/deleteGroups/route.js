import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(req) {
  try {
    const { ids } = await req.json();
    const filePath = path.join(process.cwd(), 'data', 'groups.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'No groups found' }, { status: 404 });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    let groups = JSON.parse(fileContents);

    groups = groups.filter(group => !ids.includes(group.id));

    fs.writeFileSync(filePath, JSON.stringify(groups, null, 2));

    return NextResponse.json({ message: 'Groups deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete groups' }, { status: 500 });
  }
}
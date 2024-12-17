import dbConnect from "@/lib/connectdb/connection";
import Role from "@/lib/models/Role";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const roles = await Role.find();
    return NextResponse.json({ roles });
  } catch (error) {
    console.log("Error fetching roles: " + error.message);
  }
}

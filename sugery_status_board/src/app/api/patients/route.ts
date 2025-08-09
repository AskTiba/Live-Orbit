import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("surgery_db"); // Replace with your database name
    const collection = db.collection("patients"); // Replace with your collection name

    const patients = await collection.find({}).toArray();
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db("surgery_db"); // Replace with your database name
    const collection = db.collection("patients"); // Replace with your collection name

    const result = await collection.insertOne(body);

    return NextResponse.json({ message: "Patient added successfully", insertedId: result.insertedId });
  } catch (error) {
    console.error("Error adding patient:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
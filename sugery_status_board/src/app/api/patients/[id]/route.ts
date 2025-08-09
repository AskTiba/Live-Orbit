import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const client = await clientPromise;
    const db = client.db("surgery_db"); // Replace with your database name
    const collection = db.collection("patients"); // Replace with your collection name

    const patient = await collection.findOne({ _id: new ObjectId(id) });

    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db("surgery_db"); // Replace with your database name
    const collection = db.collection("patients"); // Replace with your collection name

    // Remove _id from body if present, as we don't update the _id
    const { _id, ...updateData } = body;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData } // Use $set to update specific fields
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Patient updated successfully" });
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const client = await clientPromise;
    const db = client.db("surgery_db"); // Replace with your database name
    const collection = db.collection("patients"); // Replace with your collection name

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
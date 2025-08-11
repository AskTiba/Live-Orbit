import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const patients = await prisma.patient.findMany();
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ message: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation (add more as needed)
    if (!body.firstName || !body.lastName || !body.contactEmail) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Generate patientNumber and createdAt if not provided (or ensure they are unique/handled by Prisma)
    const patientNumber = generatePatientNumber(); // Assuming this function exists or will be created
    const createdAt = new Date().toISOString();

    const newPatient = await prisma.patient.create({
      data: {
        ...body,
        patientNumber,
        createdAt,
        status: "Checked In", // Default status
      },
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error: unknown) {
    console.error("Error adding patient:", error);
    if (error.code === 'P2002') { // Prisma unique constraint violation
      return NextResponse.json({ message: "Patient with this email or patient number already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Failed to add patient" }, { status: 500 });
  }
}

// Helper function to generate a unique patient number (if not handled by Prisma or external service)
// This should ideally be moved to a utility file or handled by the client before sending to API
function generatePatientNumber(): string {
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
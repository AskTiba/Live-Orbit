import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { patientNumber: string } }) {
  const { patientNumber } = params;
  try {
    const patient = await prisma.patient.findUnique({
      where: { patientNumber: patientNumber },
    });
    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json({ message: "Failed to fetch patient" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { patientNumber: string } }) {
  const { patientNumber } = await params;
  const body = await request.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, patientNumber: _bodyPatientNumber, createdAt: _createdAt, statusUpdatedAt: _statusUpdatedAt, ...dataToUpdate } = body;
  try {
    const updatedPatient = await prisma.patient.update({
      where: { patientNumber: patientNumber },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedPatient);
  } catch (error: unknown) {
    console.error("Error updating patient:", error);
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2025') { // Record not found
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }
    if (prismaError.code === 'P2002') { // Unique constraint violation
      return NextResponse.json({ message: "Email or patient number already exists" }, { status: 409 });
    }
    return NextResponse.json({ message: "Failed to update patient" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { patientNumber: string } }) {
  const { patientNumber } = params;
  try {
    await prisma.patient.delete({
      where: { patientNumber: patientNumber },
    });
    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting patient:", error);
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2025') { // Record not found
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Failed to delete patient" }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "src/db/db.json");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dbData = fs.readFileSync(dbPath, "utf-8");
  const data = JSON.parse(dbData);
  const patient = data.patients.find(
    (p: { id: string }) => p.id === id
  );
  return NextResponse.json(patient);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const dbData = fs.readFileSync(dbPath, "utf-8");
  const data = JSON.parse(dbData);
  const patientIndex = data.patients.findIndex(
    (p: { id: string }) => p.id === id
  );
  data.patients[patientIndex] = body;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  return NextResponse.json({ message: "Patient updated successfully" });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dbData = fs.readFileSync(dbPath, "utf-8");
  const data = JSON.parse(dbData);
  data.patients = data.patients.filter(
    (p: { id: string }) => p.id !== id
  );
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  return NextResponse.json({ message: "Patient deleted successfully" });
}

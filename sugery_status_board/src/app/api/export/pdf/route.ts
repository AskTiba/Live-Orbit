import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "src/db/db.json");

export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get("id");

  if (!patientId) {
    return NextResponse.json(
      { error: "Patient ID is required" },
      { status: 400 }
    );
  }

  try {
    const dbData = fs.readFileSync(dbPath, "utf-8");
    const data = JSON.parse(dbData);
    const patient = data.patients.find(
      (p: { id: string }) => p.id === patientId
    );

    if (!patient) {
      console.error(`Patient with ID ${patientId} not found.`);
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    console.log(`Generating PDF for patient: ${patient.firstName} ${patient.lastName} (${patient.patientNumber})`);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        console.log(`PDF generation ended. Buffer size: ${pdfData.length} bytes`);
        const filename = `${patient.firstName}_${patient.lastName}_${patient.patientNumber}.pdf`;

        const headers = new Headers();
        headers.set("Content-Type", "application/pdf");
        headers.set("Content-Disposition", `attachment; filename="${filename}"`);

        resolve(new NextResponse(pdfData, { headers }));
      });
      doc.on("error", (err) => {
        console.error("PDF generation error:", err);
        reject(err);
      });

      doc.fontSize(25).text("Patient Details", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Patient ID: ${patient.patientNumber}`);
      doc.text(`Name: ${patient.firstName} ${patient.lastName}`);
      doc.text(`Email: ${patient.contactEmail}`);
      doc.text(`Phone: ${patient.phoneNumber}`);
      doc.text(
        `Address: ${patient.streetAddress}, ${patient.city}, ${patient.state}, ${patient.country}`
      );
      doc.text(`Current Status: ${patient.status}`);

      doc.end();
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

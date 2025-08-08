"use client";

import { usePatientStore } from "@/store/patientStore"

import React, { useState, useRef, useEffect } from "react";
import { statusColors } from "@/utils/statusColors";
import SvgFileText from "@/components/icons/FileText";
import SvgFileSpreadsheet from "@/components/icons/FileSpreadsheet";
import SvgFileWord from "@/components/icons/FileWord";
import SvgUser from "@/components/icons/User";
import SvgMail from "@/components/icons/Mail";
import SvgPhone from "@/components/icons/Phone";
import SvgMapPin from "@/components/icons/MapPin";

const statusDescriptions: Record<string, string> = {
  "Checked In": "In the facility awaiting their procedure",
  "Pre-Procedure": "Undergoing surgical preparation",
  "In Progress": "Surgical produre is underway",
  Closing: "Surgery completed",
  Recovery: "Patient transferred to post-surgery recovery room",
  Complete: "Recovery completed Patient awaiting dismissal",
  Dismissal: "Transferred to hospital room or patient has left",
};

export default function PatientDetailsCard() {
  const selectedPatient = usePatientStore((s) => s.selectedPatient);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!selectedPatient) return null;

  const badgeClass =
    statusColors[selectedPatient.status] || "bg-slate-400 text-white";

  const description =
    statusDescriptions[selectedPatient.status] || "Status unknown";

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowExportOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, isMounted]);

  const handleExport = async (format: "pdf" | "excel" | "word") => {
    if (!selectedPatient?.id) {
      alert("No patient selected for export.");
      return;
    }

    let exportUrl = "";
    let filename = "";
    let contentType = "";

    switch (format) {
      case "pdf":
        exportUrl = `/api/export/pdf?id=${selectedPatient.id}`;
        filename = `${selectedPatient.firstName}_${selectedPatient.lastName}_${selectedPatient.patientNumber}.pdf`;
        contentType = "application/pdf";
        break;
      case "excel":
        exportUrl = `/api/export/excel?id=${selectedPatient.id}`;
        filename = `${selectedPatient.firstName}_${selectedPatient.lastName}_${selectedPatient.patientNumber}.xlsx`;
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
      case "word":
        exportUrl = `/api/export/word?id=${selectedPatient.id}`;
        filename = `${selectedPatient.firstName}_${selectedPatient.lastName}_${selectedPatient.patientNumber}.docx`;
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      default:
        alert("Unsupported export format.");
        return;
    }

    try {
      const response = await fetch(exportUrl);

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          `Failed to export ${format.toUpperCase()}: ${
            errorData.error || response.statusText
          }`
        );
        return;
      }

      const blob = await response.blob();

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error during ${format.toUpperCase()} export:`, error);
      alert(
        `An unexpected error occurred during ${format.toUpperCase()} export.`
      );
    }
    setShowExportOptions(false); // Close options after export
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-2xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 text-center">
          Patient Details
        </h2>
        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="flex items-center gap-1 px-3 py-1 bg-accentMain text-white rounded-md text-sm hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            <SvgFileText className="size-4" />
            Export
            <svg
              className={`w-4 h-4 ml-1 transition-transform ${
                showExportOptions ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {showExportOptions && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
            >
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <SvgFileText className="size-4 text-red-500" /> Export to PDF
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <SvgFileSpreadsheet className="size-4 text-green-500" /> Export to
                Excel
              </button>
              <button
                onClick={() => handleExport("word")}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <SvgFileWord className="size-4 text-blue-500" /> Export to Word
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <SvgUser className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Name:</span> {selectedPatient.firstName}{" "}
          {selectedPatient.lastName}
        </div>

        <div className="flex items-center gap-2">
          <SvgMail className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Email:</span>{" "}
          {selectedPatient.contactEmail}
        </div>

        <div className="flex items-center gap-2">
          <SvgPhone className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Phone:</span>{" "}
          {selectedPatient.phoneNumber}
        </div>

        <div className="flex items-center gap-2">
          <SvgMapPin className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Address:</span>{" "}
          {selectedPatient.streetAddress}, {selectedPatient.city},{" "}
          {selectedPatient.state}, {selectedPatient.country}
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500 font-medium">Current Status</p>

        <div className="flex items-center gap-3 mt-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold shadow ${badgeClass}`}
          >
            {selectedPatient.status}
          </span>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

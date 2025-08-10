"use client";

import { useState, useEffect } from "react";
import { SvgActivity } from "@/components/icons";
import {
  FileText,
  FileSpreadsheet,
  FileArchive,
  CalendarDays,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import db from "@/db/db.json";
import Personal from "@/components/icons/Personal";
import * as XLSX from 'xlsx';
import type { jsPDF } from 'jspdf';
import type { UserOptions } from 'jspdf-autotable';


// Import client-side libraries for export (user needs to install these)
// import jsPDF from 'jspdf';
// import 'jspdf-autotable'; // This extends jsPDF
// import * as XLSX from 'xlsx';

interface CustomWindow extends Window {
  jsPDF?: typeof import('jspdf').default;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  contactEmail: string;
  status: string;
  createdAt?: string; // Optional, as some entries might not have it
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [patientSearch, setPatientSearch] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);

  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  const [JsPDF, setJsPDF] = useState<typeof jsPDF | null>(null); // State to hold jsPDF constructor

  useEffect(() => {
    const loadPdfLibraries = async () => {
      const { default: jsPDF } = await import('jspdf');
      // Temporarily attach jsPDF to window for jspdf-autotable
            (window as CustomWindow).jsPDF = jsPDF;
      await import('jspdf-autotable');
      // Clean up
            delete (window as CustomWindow).jsPDF;
      setJsPDF(() => jsPDF); // Store the constructor
    };
    loadPdfLibraries();
  }, []);

  useEffect(() => {
    setAllPatients(db.patients as Patient[]);
  }, []);

  const applyFilters = () => {
    let currentFiltered = allPatients;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      currentFiltered = currentFiltered.filter((patient) => {
        if (!patient.createdAt) return false;
        const patientDate = new Date(patient.createdAt);
        return patientDate >= start && patientDate <= end;
      });
    }

    if (selectedMonth) {
      currentFiltered = currentFiltered.filter((patient) => {
        if (!patient.createdAt) return false;
        const patientMonth = new Date(patient.createdAt).getMonth() + 1;
        return patientMonth === parseInt(selectedMonth);
      });
    }

    if (selectedYear) {
      currentFiltered = currentFiltered.filter((patient) => {
        if (!patient.createdAt) return false;
        const patientYear = new Date(patient.createdAt).getFullYear();
        return patientYear === parseInt(selectedYear);
      });
    }

    if (patientSearch) {
      const lowerCaseSearch = patientSearch.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(lowerCaseSearch) ||
          patient.lastName.toLowerCase().includes(lowerCaseSearch) ||
          patient.patientNumber.toLowerCase().includes(lowerCaseSearch) ||
          patient.id.toLowerCase().includes(lowerCaseSearch) ||
          patient.patientNumber.toLowerCase().includes(lowerCaseSearch)
      );
    }

    setFilteredPatients(currentFiltered);
    setFiltersApplied(true);
  };

  const handleExportPDF = async () => {
    if (!JsPDF) {
      alert("PDF export library is still loading. Please try again in a moment.");
      return;
    }

    if (typeof window !== 'undefined') {
      const doc = new JsPDF();
      const tableColumn = ["Patient ID", "Name", "Status", "Email", "Phone"];
      const tableRows: string[][] = [];

      filteredPatients.forEach(patient => {
        const patientData = [
          patient.id,
          `${patient.firstName} ${patient.lastName}`,
          patient.status,
          patient.contactEmail,
          patient.phoneNumber,
        ];
        tableRows.push(patientData);
      });

      if (tableRows.length === 0) {
        alert("No patient data to export. Please apply filters to get data.");
        return;
      }

            doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20
      });
      const date = new Date().toLocaleDateString();
      const filename = `Patient_Report_${startDate || 'all'}_to_${endDate || 'all'}_${date}.pdf`;
      doc.text("Patient Report", 14, 15);
      doc.save(filename);
    } else {
      alert("PDF export functionality is only available in the browser.");
    }
  };

  const handleExportExcel = () => {
    // User needs to install xlsx
    // npm install xlsx
    // import * as XLSX from 'xlsx';

    if (typeof window !== 'undefined' && typeof XLSX !== 'undefined') {
      const ws = XLSX.utils.json_to_sheet(filteredPatients);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Patients");
      const date = new Date().toLocaleDateString();
      const filename = `Patient_Report_${startDate || 'all'}_to_${endDate || 'all'}_${date}.xlsx`;
      XLSX.writeFile(wb, filename);
    } else {
      alert("Excel export library not loaded. Please install xlsx.");
    }
  };

  const handleExportWord = () => {
    // Word export client-side is complex. This is a placeholder.
    // For robust Word generation, consider server-side solutions or more complex libraries like docx/docxtemplater.
    const content = filteredPatients
      .map(
        (patient) =>
          `Patient ID: ${patient.id}\nName: ${patient.firstName} ${patient.lastName}\nStatus: ${patient.status}\nEmail: ${patient.contactEmail}\nPhone: ${patient.phoneNumber}\n\n`
      )
      .join("");

    const date = new Date().toLocaleDateString();
    const filename = `Patient_Report_${startDate || "all"}_to_${
      endDate || "all"
    }_${date}.txt`; // Using .txt as a placeholder
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(
      "Word export functionality is a basic text file download. For true .docx, consider server-side generation."
    );
  };

  const months = [
    { value: "", label: "Select Month" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = [
    { value: "", label: "Select Year" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

  return (
    <main className="min-h-screen bg-viking-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto space-y-10 lg:space-y-12">
        {/* Page Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-viking-950 flex flex-col sm:flex-row justify-center items-center gap-3">
          <SvgActivity className="size-10 text-viking-400" />
          <span>Patient Reports</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Filter Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-viking-950">
                Filter Patient Data
              </h2>
              {/* Toggle button for mobile */}
              <button
                className="lg:hidden p-2 rounded-full bg-viking-100 text-viking-600 hover:bg-viking-200 transition-colors cursor-pointer"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </button>
            </div>

            {/* Filter content - conditionally rendered */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block space-y-6`}
            >
              {/* Date Range Filter */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="startDate"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-10 pr-3 py-2 focus:border-viking-500 focus:ring-viking-500 sm:text-sm"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="endDate"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-10 pr-3 py-2 focus:border-viking-500 focus:ring-viking-500 sm:text-sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  </div>
                </div>
              </div>

              {/* Month/Year Filter */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="month"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Month
                  </label>
                  <select
                    id="month"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 pl-3 pr-10 focus:border-viking-500 focus:ring-viking-500 sm:text-sm"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Year
                  </label>
                  <select
                    id="year"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 pl-3 pr-10 focus:border-viking-500 focus:ring-viking-500 sm:text-sm"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {years.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Patient Search Filter */}
              <div>
                <label
                  htmlFor="patientSearch"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Search Patient (Name or ID)
                </label>
                <input
                  type="text"
                  id="patientSearch"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-viking-500 focus:ring-viking-500 sm:text-sm"
                  placeholder="e.g., John Doe or AB12CD"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                />
              </div>

              {/* Filter Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  className="flex-1 px-4 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-viking-600 hover:bg-viking-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-viking-500 transition-colors cursor-pointer"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
                <button
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-viking-500 transition-colors cursor-pointer"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setSelectedMonth("");
                    setSelectedYear("");
                    setPatientSearch("");
                    setFilteredPatients([]);
                    setFiltersApplied(false);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Filtered Data Display & Export/Import Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-viking-950 mb-4">
              Filtered Patient Data
            </h2>

            {/* Data Table */}
            {filteredPatients.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Pat no.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {patient.patientNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{`${patient.firstName} ${patient.lastName}`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {patient.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {patient.contactEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {patient.phoneNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : filtersApplied ? (
              <div className="text-center py-12">
                <Personal className="mx-auto size-48 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No patients found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No patient data found for the selected filters.
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Personal className="mx-auto size-48 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Generate a report
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Use the filters to generate a patient report.
                </p>
              </div>
            )}

            {/* Export Buttons */}
            {filteredPatients.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-end pt-4">
                <button
                  className="flex items-center gap-2 px-4 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors cursor-pointer"
                  onClick={handleExportPDF}
                >
                  <FileText className="size-5" />
                  Export to PDF
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                  onClick={handleExportExcel}
                >
                  <FileSpreadsheet className="size-5" />
                  Export to Excel
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors cursor-pointer"
                  onClick={handleExportWord}
                >
                  <FileArchive className="size-5" />
                  Export to Word
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

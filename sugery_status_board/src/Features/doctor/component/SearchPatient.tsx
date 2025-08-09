"use client";

import { useState, useEffect } from "react";
import { usePatientStore } from "@/store/patientStore";

export default function SearchPatient() {
  const [inputId, setInputId] = useState("");
  const findPatientByPatientNumber = usePatientStore(
    (s) => s.findPatientByPatientNumber
  );
  const clearSelectedPatient = usePatientStore((s) => s.clearSelectedPatient);
  const fetchPatients = usePatientStore((s) => s.fetchPatients);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSearch = async () => {
    const trimmedId = inputId.trim();
    if (trimmedId.length === 6) {
      await findPatientByPatientNumber(trimmedId);
    } else {
      alert("Please enter a valid 6-character Patient Number.");
    }
  };

  const handleClear = () => {
    setInputId("");
    clearSelectedPatient();
  };

  return (
    <div className="bg-viking-50 border border-viking-100 shadow-sm rounded-2xl p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-viking-950 mb-1 text-center">
        Find Patient
      </h2>
      <p className="text-sm text-viking-700 mb-4 text-center">
        Enter the patient number to look up current information and update
        status
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
        <input
          type="text"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter 6-character Patient Number"
          className="w-full sm:w-auto flex-1 px-4 py-2 text-sm border border-viking-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-viking-500"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-sm font-medium bg-viking-400 text-white rounded-lg hover:bg-viking-200 transition cursor-pointer"
          >
            Look Up
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-viking-800 border border-viking-300 rounded-lg hover:bg-viking-100 transition cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

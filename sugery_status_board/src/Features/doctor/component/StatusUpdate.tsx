"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePatientStore, Status } from "@/store/patientStore";
import { statusColors } from "@/utils/statusColors";

const workflowSteps = [
  "Checked In",
  "Pre-Procedure",
  "In Progress",
  "Closing",
  "Recovery",
  "Complete",
  "Dismissal",
];

export default function StatusUpdateForm() {
  const selectedPatient = usePatientStore((s) => s.selectedPatient);
  const updatePatientStatus = usePatientStore((s) => s.updatePatientStatus);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Status | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize selectedOption when selectedPatient changes
  useEffect(() => {
    if (selectedPatient) {
      setSelectedOption(selectedPatient.status);
    }
  }, [selectedPatient]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!selectedPatient) return null;

  const currentIndex = workflowSteps.indexOf(selectedPatient.status);
  const newIndex = selectedOption
    ? workflowSteps.indexOf(selectedOption)
    : currentIndex;

  const handleOptionSelect = (step: Status) => {
    const clickedIndex = workflowSteps.indexOf(step);

    // Validation logic (same as before)
    if (clickedIndex < currentIndex) {
      if (clickedIndex === currentIndex - 1) {
        setSelectedOption(step);
      } else {
        setUpdateMessage({ type: "error", text: "Cannot go back more than one step." });
        setTimeout(() => setUpdateMessage(null), 3000);
      }
      setIsDropdownOpen(false);
      return;
    }

    if (clickedIndex > currentIndex + 1) {
      const confirmSkip = window.confirm(
        `You're about to skip ${clickedIndex - currentIndex} steps ahead. Are you sure?`
      );
      if (!confirmSkip) {
        setIsDropdownOpen(false);
        return;
      }
    }

    setSelectedOption(step);
    setUpdateMessage(null); // Clear previous messages on new selection
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const handleUpdateSubmit = async () => {
    if (!selectedOption || selectedOption === selectedPatient.status) {
      setUpdateMessage({ type: "error", text: "Please select a new status to update." });
      setTimeout(() => setUpdateMessage(null), 3000);
      return;
    }

    setIsUpdating(true);
    setUpdateMessage(null); // Clear previous messages

    const result = await updatePatientStatus(
      selectedPatient.patientNumber,
      selectedOption
    );

    setIsUpdating(false);
    setUpdateMessage({ type: result.success ? "success" : "error", text: result.message });

    // Clear message after a few seconds
    setTimeout(() => setUpdateMessage(null), 5000);
  };

  const isUpdateDisabled = isUpdating || selectedOption === selectedPatient.status;

  const currentStatusBadgeClass = statusColors[selectedPatient.status] || "bg-slate-400 text-white";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-viking-950 text-center">Update Surgery Status</h2>

      {updateMessage && (
        <div
          className={`p-3 rounded-md text-sm text-center ${updateMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {updateMessage.text}
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className={`w-full flex justify-between items-center px-4 py-2.5 rounded-lg shadow-sm border border-viking-300 bg-white text-viking-950 text-base cursor-pointer transition-all duration-200
            ${isDropdownOpen ? "ring-2 ring-viking-500 border-viking-500" : ""}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        >
          <span>
            {selectedOption ? (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[selectedOption] || "bg-slate-400 text-white"}`}>
                {selectedOption}
              </span>
            ) : (
              "Select Status"
            )}
          </span>
          <svg
            className={`h-5 w-5 text-viking-800 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full bg-white rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto ring-1 ring-black ring-opacity-5 focus:outline-none">
            <ul
              role="listbox"
              aria-labelledby="status-label"
              className="py-1"
            >
              {workflowSteps.map((step) => {
                const isCurrent = step === selectedPatient.status;
                const isSelected = step === selectedOption;
                const stepIndex = workflowSteps.indexOf(step);
                const isDisabledOption = stepIndex < currentIndex && stepIndex !== currentIndex - 1;

                return (
                  <li
                    key={step}
                    className={`text-viking-900 cursor-pointer select-none relative py-2 pl-4 pr-9 text-sm
                      ${isSelected ? "bg-viking-100 font-semibold" : "hover:bg-viking-50"}
                      ${isDisabledOption ? "text-gray-400 cursor-not-allowed" : ""}`}
                    onClick={() => !isDisabledOption && handleOptionSelect(step as Status)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[step as Status]}`}>
                        {step}
                      </span>
                      {isCurrent && (
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-viking-100 text-viking-800 text-xs font-medium">Current</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={handleUpdateSubmit}
        disabled={isUpdateDisabled}
        className="w-full bg-viking-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-viking-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isUpdating ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Updating...
          </>
        ) : (
          "Update Status"
        )}
      </button>
    </div>
  );
}

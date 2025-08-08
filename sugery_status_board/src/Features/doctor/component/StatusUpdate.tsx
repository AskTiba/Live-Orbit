"use client";

import { usePatientStore, Status } from "@/store/patientStore";

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

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;

    if (!selectedPatient || newStatus === selectedPatient.status) return;

    // Safety check: ensure newStatus is a valid Status
    if (!workflowSteps.includes(newStatus)) return;

    const newStatusTyped = newStatus as Status;

    const currentIndex = workflowSteps.indexOf(selectedPatient.status);
    const newIndex = workflowSteps.indexOf(newStatusTyped);

    if (currentIndex === newIndex) return;

    if (newIndex < currentIndex && newIndex !== currentIndex - 1) {
      alert("You cannot move status back more than one step.");
      return;
    }

    if (newIndex > currentIndex + 1) {
      const confirmSkip = window.confirm(
        `You're about to skip ${
          newIndex - currentIndex
        } steps ahead. Are you sure?`
      );
      if (!confirmSkip) return;
    }

    await updatePatientStatus(selectedPatient.patientNumber, newStatusTyped);
  };

  if (!selectedPatient) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-2xl mx-auto mt-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 text-center">
        Update Surgery Status
      </h2>
      <label htmlFor="status" className="text-sm text-gray-600 sr-only">
        Select new status
      </label>
      <div className="relative">
        <select
          id="status"
          value={selectedPatient.status}
          onChange={handleChange}
          className="block w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base cursor-pointer pr-10"
        >
          <option value="">Choose a status...</option>
          {workflowSteps.map((step) => (
            <option key={step} value={step}>
              {step}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

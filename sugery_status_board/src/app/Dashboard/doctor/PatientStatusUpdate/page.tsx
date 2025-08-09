"use client";

import { usePatientStore } from "@/store/patientStore";

import SearchPatient from "@/Features/doctor/component/SearchPatient";
import PatientInfo from "@/Features/doctor/component/PatientInfo";
import StatusUpdateForm from "@/Features/doctor/component/StatusUpdate";
import StatusWorkflow from "@/Features/doctor/component/StatusWorkflo";

import ProtectedRoute from "@/components/guards/withAuthRedirect";
import { SvgActivity } from "@/components/icons";

export default function PatientStatusUpdatePage() {
  const { selectedPatient } = usePatientStore();

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-viking-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-10">
          {/* Page Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-viking-950 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
            <SvgActivity className="size-9 sm:size-10 text-viking-400" />
            <span>Patient Status Update</span>
          </h1>

          {/* Search Input - Wrapped in a card for better visual separation */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <SearchPatient />
          </div>

          {/* Conditional Display */}
          {selectedPatient?.patientNumber ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Patient Information Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <PatientInfo />
              </div>
              {/* Status Update Form Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <StatusUpdateForm />
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <StatusWorkflow />
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
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
      <main className="min-h-screen bg-viking-50 py-10 px-6 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Heading */}
          <h1 className="text-3xl font-bold text-center text-viking-950 flex justify-center items-center gap-2">
            <SvgActivity className="size-8 text-viking-400" />
            <span>Patient Status Update</span>
          </h1>

          {/* Search Input */}
          <SearchPatient />

          {/* Conditional Display */}
          {selectedPatient?.patientNumber ? (
            <section className="bg-viking-50 rounded-2xl shadow-md px-6 space-y-6 transition-all duration-200">
              <PatientInfo />
              <hr className="border-viking-200" />
              <StatusUpdateForm />
            </section>
          ) : (
            <StatusWorkflow />
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}

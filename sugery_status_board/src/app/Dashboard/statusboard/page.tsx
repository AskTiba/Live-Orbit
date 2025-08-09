"use client";
import { useEffect, useState } from "react";
import { usePatientStore } from "@/store/patientStore";
import StatusCard from "@/Features/statusBoard/components/statusCard";
import ActivePatientCard from "@/Features/statusBoard/components/activePatientCard";
import { SvgActivity, SvgMonitor, SvgUsers } from "@/components/icons";

const PATIENTS_PER_PAGE = 8; // Define how many patients per page
const PAGE_CYCLE_INTERVAL = 20000; // 20 seconds
const AUTO_REFRESH_INTERVAL = 15000; // 15 seconds

export default function StatusBoardPage() {
  const patients = usePatientStore((state) => state.patients);
  const fetchPatients = usePatientStore((state) => state.fetchPatients);

  const [currentPage, setCurrentPage] = useState(1);

  // Auto-refresh patient data
  useEffect(() => {
    fetchPatients(); // Fetch immediately on mount
    const refreshInterval = setInterval(() => {
      fetchPatients();
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(refreshInterval);
  }, [fetchPatients]);

  // Auto-cycle through pages
  useEffect(() => {
    const totalPages = Math.ceil(patients.length / PATIENTS_PER_PAGE);
    if (totalPages > 1) {
      const pageCycleInterval = setInterval(() => {
        setCurrentPage((prevPage) => (prevPage % totalPages) + 1);
      }, PAGE_CYCLE_INTERVAL);
      return () => clearInterval(pageCycleInterval);
    } else {
      setCurrentPage(1); // Reset to first page if only one page exists
    }
  }, [patients.length]); // Re-run if patient count changes

  // Calculate patients for the current page
  const startIndex = (currentPage - 1) * PATIENTS_PER_PAGE;
  const endIndex = startIndex + PATIENTS_PER_PAGE;
  const currentPatients = patients.slice(startIndex, endIndex);
  const totalPages = Math.ceil(patients.length / PATIENTS_PER_PAGE);

  const handleManualRefresh = () => {
    fetchPatients();
    setCurrentPage(1); // Reset to first page on manual refresh
  };

  return (
    <main className="p-4 space-y-6">
      {/* Header Section */}
      <section className="flex flex-wrap justify-between px-2 py-2 gap-3 items-center">
        <div className="flex items-center space-x-2">
          <SvgMonitor className="text-viking-400 size-6" />
          <h2 className="text-xl font-bold text-viking-950">Live Updates</h2>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-1 px-3 py-1 bg-viking-400 text-white rounded-md text-sm hover:bg-viking-400/80 transition-colors cursor-pointer shadow-sm"
          >
            <SvgActivity className="size-4" />
            Refresh
          </button>
          <div className="flex items-center space-x-2 text-viking-700">
            <SvgUsers className="size-5" />
            <p className="text-sm font-medium">
              {patients.length} Active Patient(s)
            </p>
          </div>
          {totalPages > 1 && (
            <p className="text-sm text-viking-700 font-medium">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>
      </section>

      {/* Legend Section */}
      <section className="gap-2 px-2">
        <h3 className="text-xl font-medium pb-3 text-viking-800">
          Status Legend
        </h3>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            <StatusCard />
          </div>
          {/* Left gradient overlay */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          {/* Right gradient overlay */}
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Patients Display */}
      <section className="">
        <div className="w-full max-w-7xl mt-4 min-h-[40dvh] mx-auto px-4">
          {currentPatients.length ? (
            <ActivePatientCard patients={currentPatients} />
          ) : (
            <p className="text-center text-viking-700 py-8">
              No active patients yet
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

"use client";
import { useEffect, useState, useCallback, useRef } from "react"; // Added useRef
import { usePatientStore } from "@/store/patientStore";
import StatusCard from "@/Features/statusBoard/components/statusCard";
import ActivePatientCard from "@/Features/statusBoard/components/activePatientCard";
import { SvgActivity, SvgMonitor, SvgUsers } from "@/components/icons"; // Removed SvgChevronLeft, SvgChevronRight

const PATIENTS_PER_PAGE = 8; // Define how many patients per page
const PAGE_CYCLE_INTERVAL = 20000; // 20 seconds
const AUTO_REFRESH_INTERVAL = 20000; // 20 seconds (Changed from 15000)

export default function StatusBoardPage() {
  const patients = usePatientStore((state) => state.patients);
  const fetchPatients = usePatientStore((state) => state.fetchPatients);
  const loading = usePatientStore((state) => state.loading);
  const error = usePatientStore((state) => state.error);
  const isRefreshing = usePatientStore((state) => state.isRefreshing);

  const [currentPage, setCurrentPage] = useState(1);
  const [isAutoCycleActive, setIsAutoCycleActive] = useState(true);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_INTERVAL / 1000);

  const totalPages = Math.ceil(patients.length / PATIENTS_PER_PAGE);

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null); // Declared useRef

  const startRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    refreshIntervalRef.current = setInterval(() => {
      fetchPatients(true);
      setCountdown(AUTO_REFRESH_INTERVAL / 1000);
    }, AUTO_REFRESH_INTERVAL);
  }, [fetchPatients]);

  // Auto-refresh patient data
  useEffect(() => {
    fetchPatients(); // Fetch immediately on mount
    startRefreshInterval(); // Start the interval

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startRefreshInterval]); // startRefreshInterval is a dependency here

  // Countdown timer for auto-refresh
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : AUTO_REFRESH_INTERVAL / 1000));
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  // Reset countdown on refresh
  useEffect(() => {
    if (isRefreshing) {
      setCountdown(AUTO_REFRESH_INTERVAL / 1000);
    }
  }, [isRefreshing]);


  // Auto-cycle through pages
  useEffect(() => {
    if (isAutoCycleActive && totalPages > 1) {
      const pageCycleInterval = setInterval(() => {
        setCurrentPage((prevPage) => (prevPage % totalPages) + 1);
      }, PAGE_CYCLE_INTERVAL);
      return () => clearInterval(pageCycleInterval);
    }
  }, [isAutoCycleActive, totalPages]);

  // Manual pagination handlers
  const handlePageChange = (page: number) => {
    setIsAutoCycleActive(false);
    setCurrentPage(page);
    setCountdown(AUTO_REFRESH_INTERVAL / 1000);
    startRefreshInterval(); // Reset the refresh interval
  };

  const handleNextPage = () => {
    setIsAutoCycleActive(false);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    setCountdown(AUTO_REFRESH_INTERVAL / 1000);
    startRefreshInterval(); // Reset the refresh interval
  };

  const handlePrevPage = () => {
    setIsAutoCycleActive(false);
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    setCountdown(AUTO_REFRESH_INTERVAL / 1000);
    startRefreshInterval(); // Reset the refresh interval
  };


  // Calculate patients for the current page
  const startIndex = (currentPage - 1) * PATIENTS_PER_PAGE;
  const endIndex = startIndex + PATIENTS_PER_PAGE;
  const currentPatients = patients.slice(startIndex, endIndex);

  const handleManualRefresh = () => {
    fetchPatients();
    setCurrentPage(1); // Reset to first page on manual refresh
    setIsAutoCycleActive(true); // Re-enable auto-cycle on manual refresh
    setCountdown(AUTO_REFRESH_INTERVAL / 1000); // Reset countdown on manual refresh
    startRefreshInterval(); // Reset the refresh interval
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              className="flex items-center gap-1 px-3 py-1 bg-viking-400 text-white rounded-md text-sm hover:bg-viking-400/80 transition-colors cursor-pointer shadow-sm"
            >
              {isRefreshing ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <SvgActivity className="size-4" />
              )}
              Refresh
            </button>
            <span className="text-sm text-gray-500">
              (Next in {countdown}s)
            </span>
          </div>
          <div className="flex items-center space-x-2 text-viking-700">
            <SvgUsers className="size-5" />
            <p className="text-sm font-medium">
              {patients.length} Active Patient(s)
            </p>
          </div>
          {totalPages > 1 && (
             <div className="flex items-center gap-2">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  Prev
                </button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
            </div>
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
          {loading ? (
            <p className="text-center text-viking-700 py-8">
              Loading patients...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 py-8">
              Error fetching patients: {error}
            </p>
          ) : currentPatients.length > 0 ? (
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

"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { usePatientStore, Patient } from "@/store/patientStore";

import ProtectedRoute from "@/components/guards/withAuthRedirect";
import {
  SvgCancel,
  SvgClipboard,
  SvgSearch,
  SvgUsers,
  SvgFileText,
} from "@/components/icons";
import Link from "next/link";

interface IFormInput {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  contactEmail: string;
}

interface ISearchFormInput {
  searchQuery: string;
}

function PatientInformation() {
  const addPatient = usePatientStore((state) => state.addPatient);
  const patients = usePatientStore((state) => state.patients);
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<IFormInput>({
    mode: "all",
  });

  const fetchPatients = usePatientStore((state) => state.fetchPatients);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const [result] = await Promise.all([addPatient(data), delay(2000)]);
    setFormMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
  };

  useEffect(() => {
    if (formMessage) {
      if (formMessage.type === "success") {
        reset();
      }
      const timer = setTimeout(() => {
        setFormMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formMessage, reset]);

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const {
    register: registerSearch,
    watch,
    setValue,
  } = useForm<ISearchFormInput>();
  const searchQuery = watch("searchQuery");

  useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter((patient) =>
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, patients]);

  const handleClearSearch = () => {
    setValue("searchQuery", "");
    setSearchResults([]);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto lg:px-4 px-2 py-4">
        <div className="mx-4 md:mx-0 mb-3">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-4">
            <h1 className="md:text-3xl text-3xl font-bold text-viking-950 text-center sm:text-left w-full">
              Patient Information Management
            </h1>
          </div>
          <div className="flex flex-wrap justify-between sm:justify-end gap-3">
            <Link href="/Dashboard/reports" passHref>
              <button className="flex items-center gap-2 px-4 py-2 bg-viking-600 text-white rounded-md text-sm font-semibold shadow-md hover:bg-viking-700 transition-colors cursor-pointer">
                <SvgFileText className="size-5" />
                View Report
              </button>
            </Link>
            <button
              className="bg-viking-700 p-1 rounded-lg lg:hidden text-viking-50 shadow-md hover:bg-viking-800 transition-colors flex justify-center items-center cursor-pointer"
              onClick={() => setShowMobileSearch(true)}
            >
              <SvgSearch className="stroke-2" />
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* LEFT - Add Patient */}
          <main className="lg:col-span-1 rounded-lg p-3 lg:p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-viking-900">
                Add New Patient
              </h2>
              <p className="text-viking-700 text-base">
                Enter patient information to start tracking their surgical
                progress.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {formMessage && (
                <div
                  className={`p-4 rounded-md ${
                    formMessage.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {formMessage.text}
                </div>
              )}

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="block text-viking-800 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    className="border border-viking-300 rounded-md px-4 py-1 transition-all duration-200"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="block text-viking-800 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    className="border border-viking-300 rounded-md px-4 py-1 transition-all duration-200"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </section>

              {/* Address */}
              <div className="flex flex-col">
                <label
                  htmlFor="streetAddress"
                  className="block text-viking-800 mb-1"
                >
                  Street Address
                </label>
                <input
                  id="streetAddress"
                  className="border border-viking-300 rounded-md px-4 py-1 transition-all duration-200"
                  {...register("streetAddress", {
                    required: "Street address is required",
                  })}
                />
                {errors.streetAddress && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.streetAddress.message}
                  </p>
                )}
              </div>

              {/* Location Fields */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: "city", label: "City" },
                  { id: "state", label: "State" },
                  { id: "country", label: "Country" },
                ].map(({ id, label }) => (
                  <div className="flex flex-col" key={id}>
                    <label htmlFor={id} className="block text-viking-800 mb-1">
                      {label}
                    </label>
                    <input
                      id={id}
                      className="border border-viking-300 rounded-md px-4 py-1 transition-all duration-200"
                      {...register(id as keyof IFormInput, {
                        required: `${label} is required`,
                      })}
                    />
                    {errors[id as keyof IFormInput] && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors[id as keyof IFormInput]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </section>

              {/* Phone Number */}
              <div className="flex flex-col">
                <label
                  htmlFor="phoneNumber"
                  className="block text-viking-800 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  placeholder="+XXX XXXXXXXXXX"
                  className="border border-viking-300 rounded-md px-4 py-1 transition-all duration-200"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+\d{1,3}\s?[\d\s]{9,15}$/,
                      message:
                        "Invalid phone number format. Use +XXX XXXXXXXXXX",
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Contact Email */}
              <div className="flex flex-col">
                <label
                  htmlFor="contactEmail"
                  className="block text-viking-800 mb-1"
                >
                  Contact Email
                </label>
                <input
                  id="contactEmail"
                  placeholder="family@kfc.com"
                  className="border border-viking-300 rounded-md px-4 py-1 transition-all duration-200"
                  {...register("contactEmail", {
                    required: "Contact email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.contactEmail && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="bg-viking-400 text-white py-2 rounded-md flex justify-center items-center gap-2 hover:bg-viking-800 transition-colors w-full font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    <span>Adding Patient...</span>
                  </>
                ) : (
                  <>
                    <SvgClipboard className="size-6" />
                    <span>Add Patient</span>
                  </>
                )}
              </button>
            </form>
          </main>

          {/* RIGHT - Search Panel (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 shadow-lg rounded-lg p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-viking-900">
                Search Patients
              </h2>
              <p className="text-viking-700 text-base">
                Find existing patients by last name.
              </p>
            </div>
            <form className="flex flex-col gap-4">
              <input
                className="outline flex-1 rounded-sm px-2 py-1 border border-viking-300 focus:ring-2 focus:ring-viking-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter last name to search"
                {...registerSearch("searchQuery")}
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="bg-viking-200 rounded-full p-2 hover:bg-viking-500 transition-colors cursor-pointer"
                >
                  <SvgSearch className="size-6 text-viking-400" />
                </button>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="bg-viking-200 hover:bg-viking-400 text-sm font-semibold text-viking-950 px-2 py-1.5 rounded-sm cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </form>

            {searchResults.length > 0 ? (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <SvgUsers className="size-5 text-viking-400" />
                  <p className="text-viking-950 font-semibold">
                    Found {searchResults.length} patient(s)
                  </p>
                </div>
                <div className="space-y-4">
                  {searchResults.map((patient) => (
                    <div
                      key={patient.patientNumber}
                      className="bg-viking-50 p-4 rounded-lg shadow-sm"
                    >
                      <p className="font-bold text-viking-950">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-viking-700">
                        Patient Number: {patient.patientNumber}
                      </p>
                      <p className="text-sm text-viking-700">
                        Contact: {patient.phoneNumber} | {patient.contactEmail}
                      </p>
                      <p className="text-sm text-viking-700">
                        Address: {patient.streetAddress}, {patient.city},{" "}
                        {patient.state}, {patient.country}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              searchQuery && (
                <div className="mt-6 text-viking-700 text-center">
                  <p>No patients found matching &quot;{searchQuery}&quot;.</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Mobile Overlay */}
        {showMobileSearch && (
          <div className="fixed inset-0 bg-viking-950/70 backdrop-blur-lg z-50 flex flex-col items-center justify-start p-4 pt-20">
            <button
              className="absolute top-4 right-4 p-2 rounded-full text-viking-50 hover:bg-viking-800/50 transition-colors cursor-pointer"
              onClick={() => setShowMobileSearch(false)}
              aria-label="Close search"
            >
              <SvgCancel className="size-8" />
            </button>
            <h2 className="text-2xl font-bold text-viking-50 mb-6">
              Search Patients
            </h2>

            <form className="w-full max-w-md">
              <div className="relative flex items-center">
                <input
                  className="w-full rounded-md px-4 py-3 pl-10 pr-10 border border-viking-300 focus:ring-2 focus:ring-viking-500 focus:border-transparent transition-all duration-200 text-viking-50"
                  placeholder="Enter last name to search"
                  {...registerSearch("searchQuery")}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 rounded-full text-viking-50 hover:text-viking-900 cursor-pointer"
                  >
                    <SvgCancel className="text-viking-400 size-7" />
                  </button>
                )}
              </div>
            </form>

            {searchResults.length > 0 ? (
              <div className="mt-6 w-full max-w-md">
                <div className="flex items-center gap-2 mb-4 text-viking-50">
                  <SvgUsers className="size-6" />
                  <p className="font-semibold">
                    Found {searchResults.length} patient(s)
                  </p>
                </div>
                <div className="space-y-4">
                  {searchResults.map((patient) => (
                    <div
                      key={patient.patientNumber}
                      className="bg-viking-50 p-4 rounded-lg shadow-sm"
                    >
                      <p className="font-bold text-viking-950">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-viking-700">
                        Patient Number: {patient.patientNumber}
                      </p>
                      <p className="text-sm text-viking-700">
                        Contact: {patient.phoneNumber} | {patient.contactEmail}
                      </p>
                      <p className="text-sm text-viking-700">
                        Address: {patient.streetAddress}, {patient.city},{" "}
                        {patient.state}, {patient.country}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              searchQuery && (
                <div className="mt-6 w-full max-w-md text-viking-50 text-center">
                  <p>No patients found matching &quot;{searchQuery}&quot;.</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default PatientInformation;

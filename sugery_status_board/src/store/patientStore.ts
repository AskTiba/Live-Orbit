import { create } from "zustand";

// Define the status workflow
export const statusWorkflow = [
  "Checked In",
  "Pre-Procedure",
  "In Progress",
  "Closing",
  "Recovery",
  "Complete",
  "Dismissal",
] as const;

export type Status = (typeof statusWorkflow)[number];

// Define the Patient interface
export interface Patient {
  id: string; // This will now store the MongoDB _id as a string
  patientNumber: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  contactEmail: string;
  status: Status;
  createdAt: string; // New field
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  fetchPatients: () => Promise<void>;
  setPatients: (patients: Patient[]) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  addPatient: (
    patient: Omit<Patient, "id" | "patientNumber" | "status" | "createdAt">
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  updatePatientStatus: (
    patientNumber: string,
    newStatus: Status
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  findPatientByPatientNumber: (patientNumber: string) => Promise<void>;
  clearSelectedPatient: () => void;
}

const generatePatientNumber = (): string => {
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  return Array(6)
    .fill(null)
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("");
};

export const usePatientStore = create<PatientState>()((set, get) => ({
  patients: [],
  selectedPatient: null,
  fetchPatients: async () => {
    const response = await fetch("/api/patients");
    const patientsData = await response.json();
    // Map _id from MongoDB to id for the frontend
    const patients = patientsData.map((p: any) => ({
      ...p,
      id: p._id.toString(),
    }));
    set({ patients });
  },
  setPatients: (patients) => set({ patients }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  findPatientByPatientNumber: async (patientNumber) => {
    const { patients } = get();
    const patient = patients.find(
      (p) => p.patientNumber.toLowerCase() === patientNumber.toLowerCase()
    );
    set({ selectedPatient: patient || null });
  },
  clearSelectedPatient: () => set({ selectedPatient: null }),
  addPatient: async (patient) => {
    const { patients } = get();
    const emailExists = patients.some(
      (p) =>
        p.contactEmail.toLowerCase() === patient.contactEmail.toLowerCase()
    );

    if (emailExists) {
      return {
        success: false,
        message: "A patient with this email already exists.",
      };
    }

    const newPatient = {
      ...patient,
      patientNumber: generatePatientNumber(),
      status: "Checked In" as Status,
      createdAt: new Date().toISOString(), // Set creation timestamp
    };

    const response = await fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPatient),
    });

    if (response.ok) {
      // After successful addition, refetch patients to get the _id from MongoDB
      await get().fetchPatients(); 
      return {
        success: true,
        message: `Successfully added patient ${newPatient.patientNumber}!`,
      };
    } else {
      return {
        success: false,
        message: "Failed to add patient.",
      };
    }
  },
  updatePatientStatus: async (patientNumber, newStatus) => {
    const { patients, selectedPatient } = get();
    const patientToUpdate = patients.find(
      (p) => p.patientNumber === patientNumber
    );

    if (!patientToUpdate) {
      return { success: false, message: "Patient not found." };
    }

    // Use the patient's id (which is now MongoDB's _id) for the PUT request
    const response = await fetch(`/api/patients/${patientToUpdate.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      // Only send the status, as the backend uses $set
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      // Update local state after successful API call
      const updatedPatients = patients.map((p) =>
        p.patientNumber === patientNumber ? { ...p, status: newStatus } : p
      );

      const updatedSelectedPatient =
        selectedPatient?.patientNumber === patientNumber
          ? { ...selectedPatient, status: newStatus }
          : selectedPatient;

      set({
        patients: updatedPatients,
        selectedPatient: updatedSelectedPatient,
      });
      return { success: true, message: "Patient status updated." };
    } else {
      return { success: false, message: "Failed to update patient status." };
    }
  },
}));
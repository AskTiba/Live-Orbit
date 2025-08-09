import { Status } from "@/store/patientStore";

export const statusColors: Record<Status, string> = {
  "Checked In": "bg-sky-600 text-white ring-sky-700/20", // Trust + strong visibility
  "Pre-Procedure": "bg-amber-500 text-black ring-amber-600/20", // Alert but friendly
  "In Progress": "bg-orange-600 text-white ring-orange-700/20", // High energy, urgency
  Closing: "bg-violet-700 text-white ring-violet-800/20", // Deep closure tone
  Recovery: "bg-teal-500 text-white ring-teal-600/20", // Healing + bold clarity
  Complete: "bg-emerald-600 text-white ring-emerald-700/20", // Success + strong green
  Dismissal: "bg-rose-600 text-white ring-rose-700/20", // Firm end, still warm
};

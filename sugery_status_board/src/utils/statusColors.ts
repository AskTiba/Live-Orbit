import { Status } from "@/store/patientStore";

export const statusColors: Record<Status, string> = {
  "Checked In": "bg-blue-500 text-white ring-blue-600/20",
  "Pre-Procedure": "bg-yellow-500 text-white ring-yellow-600/20",
  "In Progress": "bg-orange-500 text-white ring-orange-600/20",
  Closing: "bg-purple-500 text-white ring-purple-600/20",
  Recovery: "bg-teal-500 text-white ring-teal-600/20",
  Complete: "bg-green-500 text-white ring-green-600/20",
  Dismissal: "bg-red-500 text-white ring-red-600/20",
};

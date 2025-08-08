import { Status } from "@/store/patientStore";

export const statusColors: Record<Status, string> = {
  "Checked In": "bg-blue-50 text-blue-700 ring-blue-600/20",
  "Pre-Procedure": "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
  "In Progress": "bg-orange-50 text-orange-700 ring-orange-600/20",
  Closing: "bg-purple-50 text-purple-700 ring-purple-600/20",
  Recovery: "bg-teal-50 text-teal-700 ring-teal-600/20",
  Complete: "bg-green-50 text-green-700 ring-green-600/20",
  Dismissal: "bg-gray-50 text-gray-700 ring-gray-600/20",
};

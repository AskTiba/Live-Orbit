import { statusColors } from "@/utils/statusColors";

export const StatusCardData = [
  {
    status: "Checked In",
    desc: "In the facility waiting their processing",
    indicator: statusColors["Checked In"],
  },
  {
    status: "Pre-Procedure",
    desc: "Undergoing surgical preparation",
    indicator: statusColors["Pre-Procedure"],
  },
   {
    status: "In Progress",
    desc: "Surgical produre is underway",
    indicator: statusColors["In Progress"],
  },
   {
    status: "Closing",
    desc: "Surgery completed",
    indicator: statusColors["Closing"],
  },
   {
    status: "Recovery",
    desc: "Patient transferred to post-surgery recovery room",
    indicator: statusColors["Recovery"],
  },
  {
    status: "Complete",
    desc: "Recovery completed Patient awaiting dismissal",
    indicator: statusColors["Complete"],
  },
  {
    status: "Dismissal",
    desc: "Transferred to hospital room or patient has left",
    indicator: statusColors["Dismissal"],
  },
];

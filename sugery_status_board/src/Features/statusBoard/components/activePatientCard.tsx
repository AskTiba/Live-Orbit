import { Patient } from "@/store/patientStore";
import { statusColors } from "@/utils/statusColors";
import { User, Tag, Clock } from "lucide-react"; // Importing icons

interface ActivePatientCardProps {
  patients: Patient[];
}

export default function ActivePatientCard({ patients }: ActivePatientCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {patients.map((patient) => (
        <article
          key={patient.patientNumber}
          className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 border border-gray-200 cursor-pointer"
        >
          {/* Status Badge */}
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[patient.status]}`}>
            {patient.status}
          </div>

          <div className="p-5 pt-10 space-y-3">
            {/* Patient Name */}
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              {patient.firstName} {patient.lastName}
            </h3>

            {/* Patient Number */}
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="font-medium">ID:</span> {patient.patientNumber}
            </p>

            {/* Last Updated (Placeholder for now) */}
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Last Updated: Just now
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

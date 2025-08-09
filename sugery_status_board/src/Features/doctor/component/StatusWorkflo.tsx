'use client';

import { statusColors } from "@/utils/statusColors";
import { Status } from "@/store/patientStore";

const workflowSteps = [
  'Checked In',
  'Pre-Procedure',
  'In Progress',
  'Closing',
  'Recovery',
  'Complete',
  'Dismissal',
];

export default function StatusWorkflowReference() {
  return (
    <section className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 max-w-5xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Status Workflow Reference</h2>
      <p className="text-sm text-gray-500 mb-5">
        Complete surgical workflow from admission to discharge
      </p>

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 space-y-4 sm:space-y-0">
        {workflowSteps.map((step, idx) => (
          <div key={step} className="flex items-center sm:gap-3">
            <span
              className={`
                px-4 py-1 text-sm rounded-md border transition whitespace-nowrap
                ${statusColors[step as Status]}
              `}
            >
              {step}
            </span>

            {idx < workflowSteps.length - 1 && (
              <span className="text-gray-400 text-xl font-light mx-2 sm:mx-1">
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
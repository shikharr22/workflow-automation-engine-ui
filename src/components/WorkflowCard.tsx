import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Terminal,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import type { IWorkflow } from "../pages/Dashboard/model/dashboard.model";

interface WorkflowCardProps {
  workflow: IWorkflow;
  onTrigger: (id: string) => void;
  onViewLogs: (id: string) => void;
  onDelete: (id: string) => void;
}

const WorkflowCard = ({
  workflow,
  onTrigger,
  onViewLogs,
  onDelete,
}: WorkflowCardProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleDelete = () => {
    setShowConfirm(false);
    onDelete(workflow.id);
  };

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 border border-slate-800/60 backdrop-blur-sm rounded-lg shadow p-3 flex flex-col gap-3 transition hover:shadow-lg hover:scale-[1.01] duration-200 text-white relative border border-slate-800/70">
      {/* Delete Icon */}
      <button
        onClick={() => setShowConfirm(true)}
        className="absolute top-2 right-2 bg-transparent text-slate-400 hover:text-red-500 transition p-1 rounded"
        aria-label="Delete workflow"
        style={{ lineHeight: 0 }}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded p-4 shadow flex flex-col items-center min-w-[220px] max-w-xs">
            <p className="text-gray-900 mb-2 text-center text-sm">
              Delete <b>{workflow.name}</b>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-xs"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Workflow className="w-4 h-4 text-indigo-400" />
        <h3 className="text-base font-medium truncate">{workflow.name}</h3>
      </div>

      <div className="flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Trigger:</span>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
            {workflow.trigger}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Created:</span>
          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
            {new Date(workflow.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-1 mt-2">
        <button
          onClick={() => onTrigger(workflow.id)}
          className="px-2 py-1 rounded bg-slate-800 text-white flex items-center gap-1 hover:bg-indigo-700 text-xs"
        >
          <Zap className="w-4 h-4" />
          Run
        </button>
        <button
          onClick={() => onViewLogs(workflow.id)}
          className="px-2 py-1 rounded bg-slate-800 text-white flex items-center gap-1 hover:bg-indigo-700 text-xs"
        >
          <Terminal className="w-4 h-4" />
          Logs
        </button>
        <button
          onClick={() => setShowActions((prev) => !prev)}
          className="px-2 py-1 rounded bg-slate-800 text-white flex items-center gap-1 hover:bg-indigo-700 text-xs"
        >
          Actions
          {showActions ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {showActions && (
        <div className="mt-2 w-full bg-slate-800 rounded p-2 border border-slate-700">
          <div className="text-xs font-semibold text-slate-400 mb-1">
            Actions
          </div>
          {Array.isArray(workflow.actions) && workflow.actions.length > 0 ? (
            <ul className="list-disc list-inside space-y-0.5 text-left">
              {workflow.actions.map((action: any, idx: number) => (
                <li key={idx} className="text-xs text-white">
                  {action.type && (
                    <span className="ml-1 text-slate-400">({action.type})</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-slate-500">No actions defined.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowCard;

import { useState } from "react";
import { Terminal, Workflow, X, Zap } from "lucide-react";
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

  const handleDelete = () => {
    setShowConfirm(false);
    onDelete(workflow.id);
  };

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 rounded-xl shadow-lg p-5 flex flex-col justify-between transition hover:shadow-xl hover:scale-[1.01] duration-200 items-start text-white relative border border-slate-800/60 backdrop-blur-sm">
      {/* Decorative glow */}
      <div className="absolute -inset-1 rounded-xl pointer-events-none bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-lg opacity-70 z-0" />
      {/* Delete Icon in top-right */}
      <button
        onClick={() => setShowConfirm(true)}
        className="absolute top-3 right-3 text-white hover:text-red-500 transition bg-transparent p-1 rounded"
        aria-label="Delete workflow"
        style={{ lineHeight: 0 }}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-md p-4 shadow-xl flex flex-col items-center min-w-[260px] max-w-xs">
            <p className="text-gray-900 mb-3 text-center text-sm">
              Are you sure you want to delete <b>{workflow.name}</b>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col justify-left items-left">
        <h3 className="text-lg font-semibold flex items-center gap-4 text-left">
          <Workflow className="w-4 h-4" />
          {workflow.name}
        </h3>
        <div className="flex flex-col items-start mt-4 w-full gap-1">
          <div className="grid grid-cols-2 w-full gap-x-4">
            <span className="text-xs font-medium text-slate-400 text-left">
              Triggers on:
            </span>
            <span className="text-sm text-white text-left">
              {workflow.trigger}
            </span>
          </div>
          <div className="w-full my-1 border-t border-slate-700" />
          <div className="grid grid-cols-2 w-full gap-x-4">
            <span className="text-xs font-medium text-slate-400 text-left">
              Created on:
            </span>
            <span className="text-xs text-white text-left">
              {new Date(workflow.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-start gap-2 w-full">
        <button
          onClick={() => onTrigger(workflow.id)}
          className="px-2 py-1 rounded transition bg-transparent text-white flex items-center gap-1 hover:bg-slate-800 text-sm"
        >
          <Zap className="w-3 h-3" />
          <span className="align-middle">Trigger</span>
        </button>
        <button
          onClick={() => onViewLogs(workflow.id)}
          className="px-2 py-1 rounded transition bg-transparent text-white flex items-center gap-1 hover:bg-slate-800 text-sm"
        >
          <Terminal className="w-3 h-3" />
          <span className="align-middle">View logs</span>
        </button>
      </div>
    </div>
  );
};

export default WorkflowCard;

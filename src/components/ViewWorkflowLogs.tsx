import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { getWithAuth } from "../services/api";
import { CheckCircle, XCircle } from "lucide-react";
import type { IWorkflowLog } from "../pages/Dashboard/model/dashboard.model";

interface Props {
  workflowId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ViewLogsModal = ({ workflowId, isOpen, onClose }: Props) => {
  const [logs, setLogs] = useState<IWorkflowLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchLogs = async () => {
      try {
        const data = await getWithAuth<{ workflowLogs: IWorkflowLog[] }>(
          `/workflows/logs/${workflowId}`
        );
        setLogs(data?.workflowLogs);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [workflowId, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40 px-4">
        <Dialog.Panel className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white rounded-xl p-6 max-w-2xl w-full shadow-xl">
          <Dialog.Title className="text-xl font-semibold font-mono mb-4">
            Workflow Logs
          </Dialog.Title>

          {loading ? (
            <p className="text-slate-400 font-mono">Loading logs...</p>
          ) : logs?.length === 0 ? (
            <p className="text-slate-400 font-mono">No logs found.</p>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 font-mono text-sm">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 rounded-lg p-4 shadow border border-slate-700"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-purple-300 font-medium capitalize">
                      {log.actionType}
                    </p>
                    {log.status === "success" ? (
                      <CheckCircle size={18} className="text-green-400" />
                    ) : (
                      <XCircle size={18} className="text-red-400" />
                    )}
                  </div>
                  <p className="text-slate-300 break-words">
                    <span className="text-slate-400">Message:</span>{" "}
                    {log.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(log.createdAt).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 rounded border border-white text-white bg-transparent hover:bg-white hover:text-black transition font-mono"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ViewLogsModal;

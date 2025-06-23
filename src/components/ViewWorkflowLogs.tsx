import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { getWithAuth } from "../services/api";
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
        <Dialog.Panel className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white rounded-xl p-6 max-w-xl w-full space-y-4 shadow-xl">
          <Dialog.Title className="text-xl font-semibold">
            Workflow Logs
          </Dialog.Title>

          {loading ? (
            <p className="text-gray-300">Loading...</p>
          ) : logs?.length === 0 ? (
            <p className="text-gray-300">No logs found.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm space-y-1 shadow-sm"
                >
                  <p>
                    <span className="font-semibold">Action:</span>{" "}
                    <span className="uppercase">{log.actionType}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={
                        log.status === "success"
                          ? "text-green-400 font-medium"
                          : "text-red-400 font-medium"
                      }
                    >
                      {log.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Message:</span>{" "}
                    {log.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 rounded border border-white text-white bg-transparent hover:bg-white hover:text-black transition"
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

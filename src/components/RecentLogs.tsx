import { CheckCircle, RotateCw, XCircle } from "lucide-react";
import type { IWorkflowLog } from "../pages/Dashboard/model/dashboard.model";

interface RecentLogsProps {
  logs: IWorkflowLog[];
  isLogsLoading: boolean;
  onLogsRefresh(): Promise<void>;
}

const RecentLogs = ({
  logs,
  isLogsLoading,
  onLogsRefresh,
}: RecentLogsProps) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold uppercase font-mono">
          Recent Executions
        </h2>
        <RotateCw
          onClick={() => onLogsRefresh()}
          className="w-5 h-5 text-white cursor-pointer hover:rotate-180 transition-transform duration-300"
        />
      </div>

      {/* Log Container */}
      <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
        {isLogsLoading ? (
          <p className="text-gray-400 font-mono">Refreshing logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-400 font-mono">No recent logs found.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 rounded-xl p-4 shadow"
            >
              {/* Top Row */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col space-y-1 text-left font-mono text-white">
                  <span className="text-lg font-semibold text-blue-300">
                    {log.workflowName}
                  </span>
                  <span className="text-xs text-slate-400">
                    Action:{" "}
                    <span className="text-purple-300 font-medium">
                      {log.actionType}
                    </span>
                  </span>
                </div>
                <div>
                  {log.status === "success" ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : (
                    <XCircle size={20} className="text-red-400" />
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="text-sm text-slate-300 text-left mb-2 font-mono">
                {log.message}
              </div>

              {/* Timestamp */}
              <div className="text-xs text-slate-500 font-mono">
                {new Date(log.createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentLogs;

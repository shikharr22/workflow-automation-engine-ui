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
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold uppercase">Recent executions</h2>
        <RotateCw
          onClick={() => onLogsRefresh()}
          className="w-4 h-4 cursor-pointer"
        />
      </div>
      <div className="rounded-lg shadow p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800">
        {isLogsLoading ? (
          <p className="w-full min-h-screen text-gray-400 font-mono">
            Refreshing logs...
          </p>
        ) : logs.length === 0 ? (
          <p className="text-gray-400 font-mono">No recent logs found.</p>
        ) : (
          <ul className="divide-y divide-slate-700 overflow-y-auto font-mono text-sm max-h-96">
            {logs.map((log) => (
              <li key={log.id} className="py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col justify-start text-left text-white space-y-1">
                    <p className="font-bold text-blue-300">
                      {log.workflowName ?? ""}
                    </p>
                    <p className="font-semibold text-purple-300">
                      {log.actionType}
                    </p>
                    <p className="text-sm text-slate-300">{log.message}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(log.createdAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold">
                    {log.status === "success" ? (
                      <span className="flex items-center text-green-400">
                        <CheckCircle size={16} className="mr-1" />
                      </span>
                    ) : (
                      <span className="flex items-center text-red-400">
                        <XCircle size={16} className="mr-1" />
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default RecentLogs;

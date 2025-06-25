import { useEffect, useState } from "react";
import axios, { getWithAuth, postWithAuth } from "../../services/api";
import type { IWorkflow, IWorkflowLog } from "./model/dashboard.model";
import WorkflowCard from "../../components/WorkflowCard";

import AddWorkflowForm from "../../components/AddWorkflowForm";
import ViewLogsModal from "../../components/ViewWorkflowLogs";
import RecentLogs from "../../components/RecentLogs";
import Topbar from "../../components/Topbar";
import { Plus } from "lucide-react";
import Input from "../../components/Input";

const Dashboard = () => {
  /**workflow */
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);

  /**add modal */
  const [showModal, setShowModal] = useState(false);

  /**logs modal */
  const [showLogsModal, setShowLogsModal] = useState(false);

  /**selected workflow id */
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    null
  );

  /**workflow logs data */
  const [logs, setLogs] = useState<IWorkflowLog[]>([]);

  /**workflow logs loading */
  const [isLogsLoading, setIsLogsLoading] = useState(false);

  /**search query*/
  const [searchQuery, setSearchQuery] = useState<string>("");

  /**loading in workflows */
  const [workFlowsLoading, setWorkflowsLoading] = useState(false);

  const fetchWorkflows = async (query: string = "") => {
    if (workFlowsLoading) return;

    try {
      setWorkflowsLoading(true);

      const endpoint =
        query && query.trim() !== ""
          ? `/workflows?searchQuery=${query}`
          : `workflows`;

      const data = await getWithAuth<{ workflows: IWorkflow[] }>(endpoint);
      const newData = data?.workflows;

      setWorkflows(newData);
    } catch (error) {
      console.error("Failed to fetch workflows:", error);
    } finally {
      setWorkflowsLoading(false);
    }
  };

  const handleTrigger = async (workflowId: string) => {
    try {
      setIsLogsLoading(true);
      const res = await postWithAuth(`/trigger/${workflowId}`);
      console.log("Triggered:", res);
      fetchLogs();
    } catch (error) {
      console.error("Trigger failed:", error);
    } finally {
      setIsLogsLoading(false);
    }
  };

  const handleViewLogs = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    setShowLogsModal(true);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    await axios.delete(`/workflows/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  };

  const fetchLogs = async () => {
    setIsLogsLoading(true);
    try {
      const data = await getWithAuth<{ workflowLogs: IWorkflowLog[] }>(
        "/workflows/logs/all"
      );
      setLogs(data.workflowLogs);
    } catch (err) {
      console.error("Error fetching recent logs:", err);
    } finally {
      setIsLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows("");
    fetchLogs();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 bg-white shadow">
        <Topbar />
      </div>
      <main className="flex flex-col lg:flex-row gap-6 p-6 flex-1">
        {/* Left Column - Add workflow */}
        <section className="lg:w-1/3 w-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold uppercase">User options</h2>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-1/3 flex items-center gap-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white px-4 py-2 rounded hover:brightness-110 transition"
          >
            <Plus />
            Workflow
          </button>
        </section>

        {/* Middle Column – Workflows */}
        <section className="lg:w-1/3 w-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold uppercase">Your workflows</h2>
            <div className="flex justify-end">
              <Input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => {
                  setTimeout(() => {
                    fetchWorkflows(e.target.value);
                  }, 500);

                  setSearchQuery(e.target.value);
                }}
                className="w-1/3 border border-slate-300 px-2 py-1 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all w-60"
              />
            </div>
          </div>

          <div className="overflow-y-auto overflow-x-hidden grid grid-cols-2 md:grid-cols-1 gap-4">
            {workflows?.length ? (
              workflows?.map((workflow) => {
                return (
                  <div key={workflow.id}>
                    <WorkflowCard
                      workflow={workflow}
                      onTrigger={handleTrigger}
                      onViewLogs={handleViewLogs}
                      onDelete={handleDelete}
                    />
                  </div>
                );
              })
            ) : (
              <div>No workflows found</div>
            )}
            {workFlowsLoading && (
              <p className="text-white text-center col-span-full py-4">
                Loading...
              </p>
            )}
          </div>

          {/* workflow logs modal */}
          {selectedWorkflowId && (
            <ViewLogsModal
              isOpen={showLogsModal}
              onClose={() => setShowLogsModal(false)}
              workflowId={selectedWorkflowId}
            />
          )}
        </section>

        {/* Right Column – Recent Logs */}
        <section className="lg:w-1/3 w-full bg-white">
          <RecentLogs
            logs={logs}
            isLogsLoading={isLogsLoading}
            onLogsRefresh={() => fetchLogs()}
          />
        </section>
      </main>

      <AddWorkflowForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchWorkflows("")}
      />
    </div>
  );
};

export default Dashboard;

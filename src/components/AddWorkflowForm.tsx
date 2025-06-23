import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { postWithAuth } from "../services/api";
import type {
  ICreateWorkflowPayload,
  WorkflowAction,
} from "../pages/Dashboard/model/dashboard.model";
import { Plus } from "lucide-react";
import Input from "./Input";
import SingleSelect from "./SingleSelect";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const actionTypes: WorkflowAction["type"][] = [
  "email",
  "webhook",
  "slack",
  "s3",
  "db",
];

const AddWorkflowForm = ({ isOpen, onClose, onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [actions, setActions] = useState<WorkflowAction[]>([]);
  const [error, setError] = useState("");

  const handleAddAction = () => {
    setActions([...actions, { type: "email", to: "", subject: "", body: "" }]);
  };

  const handleTypeChange = (index: number, type: WorkflowAction["type"]) => {
    setActions((prevActions) => {
      const updatedActions = [...prevActions];

      console.log(updatedActions);

      // Initialize based on type
      let newAction: WorkflowAction;
      switch (type) {
        case "email":
          newAction = { type, to: "", subject: "", body: "" };
          break;
        case "webhook":
          newAction = { type, url: "", method: "POST", payload: {} };
          break;
        case "slack":
          newAction = { type, channel: "", message: "" };
          break;
        case "s3":
          newAction = { type, operation: "upload", filePath: "" };
          break;
        case "db":
          newAction = {
            type,
            query: "",
            dbConfig: { host: "", user: "", password: "", db: "" },
          };
          break;
      }

      updatedActions[index] = newAction;

      return updatedActions;
    });
  };

  const handleFieldChange = (
    index: number,
    field: string,
    value: any,
    nestedField?: string
  ) => {
    const updated = [...actions];
    if (nestedField) {
      (updated[index] as any)[field][nestedField] = value;
    } else {
      (updated[index] as any)[field] = value;
    }
    setActions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const payload: ICreateWorkflowPayload = {
        name,
        trigger,
        actions,
      };

      await postWithAuth("/workflows", payload);
      setName("");
      setTrigger("");
      setActions([]);
      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to create workflow.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40 px-4">
        <Dialog.Panel className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 rounded-xl p-6 max-w-2xl w-full space-y-4 shadow-lg">
          <Dialog.Title className="text-xl font-semibold text-white">
            Add Workflow
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Name"
              className="w-full border px-3 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Trigger"
              className="w-full border px-3 py-2 rounded"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              required
            />

            {actions?.map((action, index) => (
              <div key={index} className="border rounded p-4 space-y-2">
                <SingleSelect
                  className="w-full border px-2 py-1 rounded"
                  value={action?.type}
                  onChange={(value) =>
                    handleTypeChange(index, value as WorkflowAction["type"])
                  }
                  options={actionTypes.map((type) => ({
                    value: type,
                    label: type.toUpperCase(),
                  }))}
                />

                {/* Fields per action */}
                {action?.type === "email" && (
                  <>
                    <Input
                      type="email"
                      placeholder="To"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.to}
                      onChange={(e) =>
                        handleFieldChange(index, "to", e.target.value)
                      }
                    />
                    <Input
                      type="text"
                      placeholder="Subject"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.subject}
                      onChange={(e) =>
                        handleFieldChange(index, "subject", e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Body"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.body}
                      onChange={(e) =>
                        handleFieldChange(index, "body", e.target.value)
                      }
                    />
                  </>
                )}

                {action?.type === "webhook" && (
                  <>
                    <Input
                      type="url"
                      placeholder="URL"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.url}
                      onChange={(e) =>
                        handleFieldChange(index, "url", e.target.value)
                      }
                    />
                    <select
                      value={action?.method}
                      onChange={(e) =>
                        handleFieldChange(index, "method", e.target.value)
                      }
                      className="w-full border px-2 py-1 rounded"
                    >
                      <option value="POST">POST</option>
                      <option value="GET">GET</option>
                    </select>
                  </>
                )}

                {action?.type === "slack" && (
                  <>
                    <Input
                      type="text"
                      placeholder="Channel"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.channel}
                      onChange={(e) =>
                        handleFieldChange(index, "channel", e.target.value)
                      }
                    />
                    <Input
                      type="text"
                      placeholder="Message"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.message}
                      onChange={(e) =>
                        handleFieldChange(index, "message", e.target.value)
                      }
                    />
                  </>
                )}

                {action?.type === "s3" && (
                  <>
                    <select
                      value={action?.operation}
                      onChange={(e) =>
                        handleFieldChange(index, "operation", e.target.value)
                      }
                      className="w-full border px-2 py-1 rounded"
                    >
                      <option value="upload">Upload</option>
                      <option value="download">Download</option>
                    </select>
                    <Input
                      type="text"
                      placeholder="File Path"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.filePath}
                      onChange={(e) =>
                        handleFieldChange(index, "filePath", e.target.value)
                      }
                    />
                  </>
                )}

                {action?.type === "db" && (
                  <>
                    <Input
                      type="text"
                      placeholder="SQL Query"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.query}
                      onChange={(e) =>
                        handleFieldChange(index, "query", e.target.value)
                      }
                    />
                    <Input
                      type="text"
                      placeholder="Host"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.dbConfig?.host}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "dbConfig",
                          e.target.value,
                          "host"
                        )
                      }
                    />
                    <Input
                      type="text"
                      placeholder="User"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.dbConfig?.user}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "dbConfig",
                          e.target.value,
                          "user"
                        )
                      }
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.dbConfig?.password}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "dbConfig",
                          e.target.value,
                          "password"
                        )
                      }
                    />
                    <Input
                      type="text"
                      placeholder="Database"
                      className="w-full border px-2 py-1 rounded"
                      value={action?.dbConfig?.db}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "dbConfig",
                          e.target.value,
                          "db"
                        )
                      }
                    />
                  </>
                )}
              </div>
            ))}

            <button
              type="button"
              className="bg-transparent flex items-center gap-1 text-white text-xs border border-white rounded px-2 py-1"
              onClick={handleAddAction}
            >
              <Plus className="w-4 h-4" />
              <span>Action</span>
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="text-sm px-4 py-2 rounded border border-white bg-transparent text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border border-white bg-transparent text-white px-4 py-2 text-sm rounded"
              >
                Add Workflow
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddWorkflowForm;

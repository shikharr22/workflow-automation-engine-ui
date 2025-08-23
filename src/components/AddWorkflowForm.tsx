import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { postWithAuth } from "../services/api";
import Input from "./Input";
import SingleSelect from "./SingleSelect";
import { Plus, X } from "lucide-react";

type ActionFormState =
  | { type: "email"; to?: string; subject?: string; body?: string }
  | { type: "webhook"; url?: string; method?: "POST" | "GET"; payload?: string }
  | { type: "slack"; channel?: string; message?: string }
  | { type: "s3"; operation?: "upload" | "download"; filePath?: string }
  | {
      type: "db";
      query?: string;
      dbConfig?: {
        host?: string;
        user?: string;
        password?: string;
        db?: string;
      };
    };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const actionTypes = [
  { value: "email", label: "EMAIL" },
  { value: "webhook", label: "WEBHOOK" },
  { value: "slack", label: "SLACK" },
  { value: "s3", label: "S3" },
  { value: "db", label: "DB" },
];

const AddWorkflowForm = ({ isOpen, onClose, onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  // Use ActionFormState instead of any
  const [actions, setActions] = useState<ActionFormState[]>([]);
  const [error, setError] = useState("");

  const handleAddAction = () => {
    setActions((prev) => [...prev, { type: "email" }]);
  };

  const handleActionTypeChange = (index: number, value: string) => {
    setActions((prev) => {
      const updated = [...prev];
      // Reset fields when type changes
      switch (value) {
        case "email":
          updated[index] = { type: "email" };
          break;
        case "webhook":
          updated[index] = { type: "webhook" };
          break;
        case "slack":
          updated[index] = { type: "slack" };
          break;
        case "s3":
          updated[index] = { type: "s3" };
          break;
        case "db":
          updated[index] = { type: "db" };
          break;
        default:
          updated[index] = { type: value } as ActionFormState;
      }
      return updated;
    });
  };

  const handleActionFieldChange = (
    index: number,
    field: string,
    value: unknown
  ) => {
    setActions((prev) => {
      const updated = [...prev];
      if (updated[index].type === "db" && field === "dbConfig") {
        updated[index] = {
          ...updated[index],
          dbConfig: value,
        } as ActionFormState;
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value,
        } as ActionFormState;
      }
      return updated;
    });
  };

  const renderActionFields = (action: ActionFormState, index: number) => {
    switch (action.type) {
      case "email":
        return (
          <>
            <Input
              type="email"
              placeholder="To"
              value={action.to || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "to", e.target.value)
              }
              required
            />
            <Input
              type="text"
              placeholder="Subject"
              value={action.subject || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "subject", e.target.value)
              }
              required
            />
            <Input
              type="text"
              placeholder="Body"
              value={action.body || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "body", e.target.value)
              }
              required
            />
          </>
        );
      case "webhook":
        return (
          <>
            <Input
              type="url"
              placeholder="URL"
              value={action.url || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "url", e.target.value)
              }
              required
            />
            <SingleSelect
              value={action.method || "POST"}
              onChange={(e) =>
                handleActionFieldChange(index, "method", e.target.value)
              }
              options={[
                { value: "POST", label: "POST" },
                { value: "GET", label: "GET" },
              ]}
              className="w-full bg-white text-black"
            />
            <Input
              type="text"
              placeholder="Payload (optional)"
              value={action.payload || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "payload", e.target.value)
              }
            />
          </>
        );
      case "slack":
        return (
          <>
            <Input
              type="text"
              placeholder="Channel"
              value={action.channel || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "channel", e.target.value)
              }
              required
            />
            <Input
              type="text"
              placeholder="Message"
              value={action.message || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "message", e.target.value)
              }
              required
            />
          </>
        );
      case "s3":
        return (
          <>
            <SingleSelect
              value={action.operation || "upload"}
              onChange={(e) =>
                handleActionFieldChange(index, "operation", e.target.value)
              }
              options={[
                { value: "upload", label: "Upload" },
                { value: "download", label: "Download" },
              ]}
              className="w-full bg-white text-black"
            />
            <Input
              type="text"
              placeholder="File Path"
              value={action.filePath || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "filePath", e.target.value)
              }
              required
            />
          </>
        );
      case "db":
        return (
          <>
            <Input
              type="text"
              placeholder="Query"
              value={action.query || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "query", e.target.value)
              }
              required
            />
            <Input
              type="text"
              placeholder="DB Host"
              value={action.dbConfig?.host || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "dbConfig", {
                  ...action.dbConfig,
                  host: e.target.value,
                })
              }
              required
            />
            <Input
              type="text"
              placeholder="DB User"
              value={action.dbConfig?.user || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "dbConfig", {
                  ...action.dbConfig,
                  user: e.target.value,
                })
              }
              required
            />
            <Input
              type="password"
              placeholder="DB Password"
              value={action.dbConfig?.password || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "dbConfig", {
                  ...action.dbConfig,
                  password: e.target.value,
                })
              }
              required
            />
            <Input
              type="text"
              placeholder="DB Name"
              value={action.dbConfig?.db || ""}
              onChange={(e) =>
                handleActionFieldChange(index, "dbConfig", {
                  ...action.dbConfig,
                  db: e.target.value,
                })
              }
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        name,
        trigger,
        actions: actions.map((action) => {
          if (action.type === "db") {
            return {
              type: action.type,
              query: action.query,
              dbConfig: action.dbConfig,
            };
          }
          return { ...action };
        }),
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
        <Dialog.Panel className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white rounded-xl p-6 max-w-xl w-full shadow-xl relative">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 bg-transparent text-white hover:text-slate-400 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <Dialog.Title className="text-xl font-semibold font-mono mb-4">
            Add Workflow
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            <Input
              type="text"
              placeholder="Workflow name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Trigger (e.g., on user login)"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              required
            />

            {actions.map((action, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 space-y-2"
              >
                <SingleSelect
                  value={action.type}
                  onChange={(e) =>
                    handleActionTypeChange(index, e.target.value)
                  }
                  options={actionTypes}
                  className="w-full bg-white text-black"
                />
                {renderActionFields(action, index)}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddAction}
              className="flex items-center gap-1 text-xs border border-white rounded px-2 py-1 text-black transition"
            >
              <Plus className="w-4 h-4" />
              Add Action
            </button>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="border border-white bg-transparent text-white px-4 py-2 text-sm rounded hover:bg-white hover:text-black transition"
              >
                Create Workflow
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddWorkflowForm;

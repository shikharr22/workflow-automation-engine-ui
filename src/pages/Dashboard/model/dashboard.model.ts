export interface IWorkflow {
  id: string;
  name: string;
  trigger: string;
  actions: WorkflowAction[];
  userId: string;
  createdAt: string;
  isAI?: boolean;
  prompt?: string;
  aiContext?: any;
}

export interface ICreateWorkflowPayload {
  name: string;
  trigger: string;
  actions: unknown;
  isAI?: boolean;
  prompt?: string;
  aiContext?: any;
}

export interface IWorkflowLog {
  id: string;
  workflowName: string;
  workflowId: string;
  actionType: string;
  status: string;
  message: string;
  createdAt: string;
}

export type WorkflowAction =
  | { type: "email"; to: string; subject: string; body: string }
  | { type: "webhook"; url: string; method: "POST" | "GET"; payload?: unknown }
  | { type: "slack"; channel: string; message: string }
  | { type: "s3"; operation: "upload" | "download"; filePath: string }
  | {
      type: "db";
      query: string;
      dbConfig: { host: string; user: string; password: string; db: string };
    }
  | { type: "ai-agent"; prompt: string; context?: any };

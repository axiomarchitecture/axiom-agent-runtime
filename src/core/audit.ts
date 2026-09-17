import type { AuditEvent } from "./types.js";

export function audit(
  events: AuditEvent[],
  stage: string,
  status: string,
  message: string
): void {
  events.push({
    stage,
    status,
    timestamp: new Date().toISOString(),
    message
  });
}

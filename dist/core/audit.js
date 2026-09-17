export function audit(events, stage, status, message) {
    events.push({
        stage,
        status,
        timestamp: new Date().toISOString(),
        message
    });
}

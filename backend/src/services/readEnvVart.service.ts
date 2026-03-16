// Utility functions to read environment variables with defaults and types

function envBool(name: string, defaultValue: boolean): boolean {
  const v = process.env[name];
  if (!v) return defaultValue;
  return ["1", "true", "yes", "on"].includes(v.toLowerCase());
}

function envStr(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length ? v.trim() : undefined;
}

function envInt(name: string, defaultValue: number): number {
  const v = envStr(name);
  if (!v) return defaultValue;
  const n = Number(v);
  return Number.isFinite(n) ? n : defaultValue;
}

export { envBool, envStr, envInt };

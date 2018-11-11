export interface ILogger {
  log: (message: string) => void
  success: (message: string) => void
  error: (message: string) => void
}

import { ILogger } from './ILogger'

export class ConsoleLogger implements ILogger {
  public log (...args) {
    console.log(...args)
  }
  public error(...args) {
    console.error(...args)
  }
}

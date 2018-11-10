import { ILogger } from './ILogger'

export class StringLogger implements ILogger {
  logs: string
  constructor() {
    this.logs = ''
  }
  public log (...args: string[]) {
    this.logs = this.logs.concat(...args, '\n')
  }
  public error(...args: string[]) {
    this.logs = this.logs.concat(...args, '\n')
  }
}

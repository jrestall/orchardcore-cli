import chalk from 'chalk'
import { ILogger } from './ILogger'

const errorStyle = chalk.red
const successStyle = chalk.green

export class ConsoleLogger implements ILogger {
  public log (...args) {
    console.log(...args)
  }
  public success(...args) {
    const styledArgs = args.map((arg) => successStyle(arg))
    console.log(...styledArgs)
  }
  public error(...args) {
    const styledArgs = args.map((arg) => errorStyle(arg))
    console.error(...styledArgs)
  }
}

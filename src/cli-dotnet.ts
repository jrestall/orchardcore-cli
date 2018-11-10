import { App } from './App'
import { StringLogger } from './utils/StringLogger'

// Will be called by dotnet cli

module.exports = async function(callback, ...args: string[]) {
  console.log(args)

  const logger = new StringLogger()
  await App.run(args, logger)

  callback(/* error */ null, logger.logs)
}

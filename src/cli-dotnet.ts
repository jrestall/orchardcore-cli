import { App } from './App'
import { StringLogger } from './utils/StringLogger'

// Will be called by dotnet cli

module.exports = async function(callback, ...args: string[]) {
  // Make the logger a string so that we can return output to dotnet
  const logger = new StringLogger()
  App.logger = logger

  await App.run(args, function(_err, output) {
    const response = logger.logs + output
    callback(null /* error */, response)
  })
}

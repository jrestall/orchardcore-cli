import * as yargs from 'yargs'
import { YargsCommandLoader } from './graphql/YargsCommandLoader'

import { Config } from './Config'
import { ILogger } from './utils/ILogger'
import { ConsoleLogger } from './utils/ConsoleLogger'

export class App {
  public static logger: ILogger = new ConsoleLogger()

  public static async run(args: string[], callback?) {
    this.logger.log('Welcome to Orchard Core CLI')

    yargs.usage('\nUsage: orchardcore <cmd> [args]')
      .scriptName('orchardcore')
      .commandDir('cmds')
      .demandCommand(1, 'Please specify a command.')
      .help()
      .alias('h', 'help')
      .version()
      .alias('v', 'version')
      .strict()
      .recommendCommands()
      .epilog('For more information, find the documentation at https://orchardcore.readthedocs.io/')

    const config = await Config.loadConfig()
    if (!config || !config.host) {
      this.logger.error('\nPlease first configure an Orchard Core host by running:\n')
      this.logger.error('    orchardcore config --host "https://{domain}/graphql"\n')
    } else {
      await new YargsCommandLoader(yargs.default, config, this.logger).load()
    }

    yargs.parse(args, function (err, argv, output) {
      if (callback) {
        App.handleCallback(callback, err, argv, output)
      } else {
        if (output) App.logger.log(output)
        if (err) App.logger.error(err)
      }
    })
  }

  private static handleCallback(callback, err, argv, output) {
    // https://github.com/yargs/yargs/issues/1069
    if (argv.promisedResult) {
      argv.promisedResult.then(() => callback(err, output))
    } else {
      callback(err, output)
    }
  }
}

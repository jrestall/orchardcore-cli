import * as yargs from 'yargs'
import { YargsCommandLoader } from './graphql/YargsCommandLoader'

import { Config } from './Config'
import { ILogger } from './utils/ILogger'

export class App {
  public static async run(args: string[], logger: ILogger) {
    logger.log('Welcome to Orchard Core CLI')

    let argv = yargs.usage('\nUsage: orchardcore <cmd> [args]')
      .scriptName('orchardcore')
      .commandDir('cmds')
      .demandCommand(1, 'Please specify a command.')
      .help('h')
      .alias('h', 'help')
      .version()
      .alias('v', 'version')
      .strict()
      .recommendCommands()
      .epilog('For more information, find the documentation at https://orchardcore.readthedocs.io/')
      .fail((msg) => {
        logger.error(msg)
      })

    const config = await Config.loadConfig()
    if (!config || !config.host) {
      logger.error('Please first configure an Orchard Core host by running:\n')
      logger.error('    orchardcore config --host "https://{domain}/graphql"\n')
      argv.parse()
    } else {
      await new YargsCommandLoader(argv, config, logger)
        .load()
      argv.parse(args)
    }
  }
}

import * as yargs from 'yargs'
import { YargsCommandLoader } from './graphql/YargsCommandLoader'

import { Config } from './Config'

console.log('Welcome to Orchard Core CLI')

let argv = yargs.usage('\nUsage: orchardcore <cmd> [args]')
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
    console.error(msg)
    process.exit(1)
  });

(async () => {
  const config = await Config.loadConfig()
  if (!config || !config.host) {
    console.error('Please first configure an Orchard Core host by running:\n')
    console.error('    orchardcore config --host "https://{domain}/graphql"\n')
    argv.parse()
  } else {
    new YargsCommandLoader(argv, config)
      .load()
      .then(() => argv.parse())
      .catch((msg) => {
        console.error(msg)
        process.exit(1)
      })
  }
})()

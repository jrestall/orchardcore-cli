import { Config } from '../Config'
import { App } from '../App'

export const command = 'config'

export const desc = 'Sets the CLI config'

export const builder = (yargs) => {
  return yargs
    .usage('Usage: orchardcore config [options]')
    .option('host', {
      describe: 'host to manage',
      type: 'string'
    })
}

export const handler = async (argv) => {
  await Config.saveConfig({ host: argv.host })
  App.logger.success(`Config set successfully`)
}

import { App } from './App'
import { ConsoleLogger } from './utils/ConsoleLogger'

// Will be called by nodejs

const logger = new ConsoleLogger()
App.run(process.argv, logger)
   .catch(msg => logger.error(msg))

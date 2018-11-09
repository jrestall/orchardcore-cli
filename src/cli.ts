import yargs, {Argv} from 'yargs'
import { getCommandBinding } from './graphql'

console.log("Welcome to Orchard Core CLI")

yargs.usage('\nUsage: orchardcore <cmd> [args]')
  //.commandDir('cmds')
  .demandCommand(1, 'Please specify a command.')
  .help('h')
  .alias('h', 'help')
  .strict()
  .recommendCommands()
  .version()
  .alias('v', 'version')
  .epilog('For more information, find the documentation at https://orchardcore.readthedocs.io/')
  .fail((msg) => {
    console.error(msg)
    process.exit(1)
  })

loadCommands(yargs)
  .then(x => x.argv)

async function loadCommands(args: Argv) : Promise<Argv> {
  // Load all graphql mutations as yarg commands
  var binding = await getCommandBinding("http://api.githunt.com/graphql");
  binding.commands.forEach(command => { args.command(command) }); 

  return args;
}
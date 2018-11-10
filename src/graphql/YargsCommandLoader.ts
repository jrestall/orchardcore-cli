import { Argv } from 'yargs'
import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools'

import { CommandBinding } from './CommandBinding'
import { ConfigOptions } from '../Config'

export class YargsCommandLoader {
  argv: Argv
  config: ConfigOptions

  constructor(argv: Argv, config: ConfigOptions) {
    this.argv = argv
    this.config = config
  }

  public async load(): Promise<void> {
    const link = this.getLink(this.config.host)
    const schema = await this.getExecutableSchema(link)

    // Create the `before` function
    const before = () => console.log(`Sending a request to Orchard Core ...`)

    const binding = new CommandBinding({ schema, before })

    // Initialize yargs with the bound graphql commands
    binding.commands.forEach(command => { this.argv.command(command) })
  }

  private getLink(uri) {
    const http = new HttpLink({ uri: uri, fetch })
    const link = setContext((request, previousContext) => ({
          headers: {
              'Authorization': `Bearer 12345`
          }
          })).concat(http)

    return link
  }

  private async getExecutableSchema(link) {
    const schema = await introspectSchema(link)

    const executableSchema = makeRemoteExecutableSchema({
      schema,
      link,
    })

    return executableSchema
  }
}

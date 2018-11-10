import { Argv } from 'yargs'
import fetch from 'node-fetch'
import { GraphQLSchema } from 'graphql'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools'

import { CommandBinding } from './CommandBinding'
import { ConfigOptions } from '../Config'
import { ILogger } from '../utils/ILogger'

export class YargsCommandLoader {
  private argv: Argv
  private config: ConfigOptions
  private logger: ILogger

  constructor(argv: Argv, config: ConfigOptions, logger: ILogger) {
    this.argv = argv
    this.config = config
    this.logger = logger
  }

  public async load(): Promise<void> {
    const link = this.getLink(this.config.host)
    const schema = await this.getExecutableSchema(link)

    this.loadCommands(schema)
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

  private async getExecutableSchema(link): Promise<GraphQLSchema> {
    const schema = await introspectSchema(link)
    const executableSchema = makeRemoteExecutableSchema({
      schema,
      link,
    })

    return executableSchema
  }

  private loadCommands(schema: GraphQLSchema) {
    // Create the `before` function
    const before = () => this.logger.log(`Sending a request to Orchard Core ...`)

    const binding = new CommandBinding({ schema, before }, this.logger)

    // Initialize yargs with the bound graphql commands
    binding.commands.forEach(command => { this.argv.command(command) })
  }
}

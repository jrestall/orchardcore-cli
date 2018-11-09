import {
    GraphQLField,
    GraphQLInputType,
    GraphQLFieldMap,
    isScalarType,
    isNullableType
  } from 'graphql'

import { Delegate, BindingOptions } from 'graphql-binding'
import { CommandModule, Argv } from 'yargs'

declare type QueryOrMutation = 'query' | 'mutation';
declare type PositionalOptionsType = "boolean" | "number" | "string";

export default class CommandBinding extends Delegate
{
    commands: CommandModule[]

    constructor({ schema, fragmentReplacements, before }: BindingOptions) {
      super({ schema, fragmentReplacements, before })

      this.commands = this.mapMutations();
    }

    mapMutations(): CommandModule[]
    {
        var mutationType = this.schema.getMutationType();
        if (!mutationType) {
            return [];
        }
    
        return this.buildCommands('mutation', mutationType.getFields());
    }
    
    buildCommands(operation: QueryOrMutation, fields: GraphQLFieldMap<any, any>): CommandModule[] {
      return Object.entries(fields)
        .map(([fieldName, field]) => {
          return this.buildCommand(operation, fieldName, field);
        })
    }

    buildCommand(operation: QueryOrMutation, fieldName: string, field: GraphQLField<any, any>): CommandModule
    {
      var binding = this;
      return {
        command: this.buildCommandString(fieldName, field),
        describe: field.description != null ? field.description : false,
        handler: (args) => {
          return this.delegate(operation, fieldName, args)
        },
        builder: function (yargs) {
          return binding.buildCommandArguments(yargs, field);
        }
      }
    }

    buildCommandString(fieldName: string, field: GraphQLField<any, any>) : string
    {
      let command = fieldName;

      const hasArgs = field.args.length > 0;
      if(!hasArgs)
      {
        return command;
      }

      field.args.forEach(arg => {
        if(isNullableType(arg.type))
        {
          command += " [" + arg.name + "]";
        }
        else
        {
          command += " <" + arg.name + ">";
        }
      });

      return command;
    }
    
    buildCommandArguments(yargs: Argv, field: GraphQLField<any, any>) : Argv
    {
      const hasArgs = field.args.length > 0;
      if(!hasArgs)
      {
        return yargs;
      }

      field.args.forEach(arg => {
        yargs.positional(arg.name, {
          describe: arg.description != null ? arg.description : undefined,
          type: this.GetArgumentType(arg.type),
          default: arg.defaultValue
        })
      });

      return yargs;
    }

    GetArgumentType(type: GraphQLInputType) : PositionalOptionsType
    {
      if (isScalarType(type)) {
        return 'string';
      }
      return 'string';
    }
}
  
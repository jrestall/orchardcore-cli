import {
    GraphQLField,
    GraphQLObjectType,
    GraphQLInputType,
    GraphQLFieldMap,
    GraphQLArgument,
    GraphQLScalarType,
    GraphQLEnumType,
    isNullableType,
    isScalarType,
    isEnumType,
    getNullableType
  } from 'graphql'

import { Choices, PositionalOptionsType, PositionalOptions } from 'yargs'
import { Delegate, BindingOptions } from 'graphql-binding'
import { QueryOrMutation } from 'graphql-binding/dist/types'
import { CommandModule, Argv } from 'yargs'

export default class CommandBinding extends Delegate
{
    commands: CommandModule[]

    constructor({ schema, fragmentReplacements, before }: BindingOptions) {
      super({ schema, fragmentReplacements, before })

      this.commands = this.mapMutations()
    }

    private mapMutations(): CommandModule[] {
        const mutationType = this.schema.getMutationType()
        if (!mutationType) {
            return []
        }
    
        return this.buildCommands('mutation', mutationType.getFields())
    }
    
    private buildCommands(operation: QueryOrMutation, fields: GraphQLFieldMap<any, any>): CommandModule[] 
    { 
      return Object.entries(fields)
        .map(([fieldName, field]) => {
          return this.buildCommand(operation, fieldName, field)
        })
    }

    private buildCommand(operation: QueryOrMutation, fieldName: string, field: GraphQLField<any, any>): CommandModule 
    {
      const binding = this
      return {
        command: this.buildCommandString(fieldName, field),
        describe: this.buildDescription(field),
        handler: (args) => {
          return this.delegate(operation, fieldName, args)
        },
        builder: function (yargs) {
          return binding.buildCommandArguments(yargs, field.args)
        }
      }
    }

    private buildCommandString(fieldName: string, field: GraphQLField<any, any>) : string 
    {
      let command = fieldName;

      const hasArgs = field.args.length > 0
      if(!hasArgs)
      {
        return command;
      }

      command += this.buildCommandArgumentsString(field.args)

      return command
    }

    private buildCommandArgumentsString(args: GraphQLArgument[]) : string 
    {
      let result = ''

      args.forEach(arg => {
        if(arg.type instanceof GraphQLObjectType)
        {
          const objectFields = (arg.type as GraphQLObjectType).getFields()
          Object.entries(objectFields).forEach(([objectFieldName, objectField]) => {
            result += this.buildCommandArgumentsString(objectField.args);
          })
        }
        else
        {
          result += isNullableType(arg.type) || arg.defaultValue ? ` [${arg.name}]` : ` <${arg.name}>`
        }
      })

      return result
    }

    private buildDescription(field: GraphQLField<any, any>) : string | false
    {
      if(field.isDeprecated === true)
      {
        return `[Deprecated] ${field.description}`
      }

      return field.description ? field.description : false
    }
    
    private buildCommandArguments(yargs: Argv, args: GraphQLArgument[]) : Argv
    {
      args.forEach(arg => {
        const nullableType = getNullableType(arg.type)

        if(nullableType instanceof GraphQLObjectType)
        {
          const objectFields = (nullableType as GraphQLObjectType).getFields()
          Object.entries(objectFields).forEach(([objectFieldName, objectField]) => {
            this.buildCommandArguments(yargs, objectField.args);
          })
        }
        else
        {
          const options:PositionalOptions = {
            describe: arg.description != null ? arg.description : undefined,
            type: this.getArgumentType(nullableType),
            default: arg.defaultValue
          }

          if(isEnumType(nullableType))
          {
            options.choices = this.getArgumentChoices(nullableType)
          }

          yargs.positional(arg.name, options)
        }
      });

      return yargs
    }

    private getArgumentType(type: GraphQLInputType) : PositionalOptionsType
    {
      if(!isScalarType(type))
      {
        return 'string'
      }

      const scalarType = type as GraphQLScalarType
      if(scalarType.name === 'Boolean')
      {
        return 'boolean'
      }
      else if(scalarType.name === 'Int' || scalarType.name === 'Float')
      {
        return 'number'
      }  
      return 'string'
    }

    private getArgumentChoices(type: GraphQLInputType) : Choices | undefined 
    {
      const enumValues = (type as GraphQLEnumType).getValues()
      return enumValues.map(enumValue => {
        return enumValue.value
      });
    }
}
  
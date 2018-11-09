import { GraphQLField, GraphQLInputType, GraphQLFieldMap } from 'graphql';
import { Delegate, BindingOptions } from 'graphql-binding';
import { CommandModule, Argv } from 'yargs';
declare type QueryOrMutation = 'query' | 'mutation';
declare type PositionalOptionsType = "boolean" | "number" | "string";
export default class CommandBinding extends Delegate {
    commands: CommandModule[];
    constructor({ schema, fragmentReplacements, before }: BindingOptions);
    mapMutations(): CommandModule[];
    buildCommands(operation: QueryOrMutation, fields: GraphQLFieldMap<any, any>): CommandModule[];
    buildCommand(operation: QueryOrMutation, fieldName: string, field: GraphQLField<any, any>): CommandModule;
    buildCommandString(fieldName: string, field: GraphQLField<any, any>): string;
    buildCommandArguments(yargs: Argv, field: GraphQLField<any, any>): Argv;
    GetArgumentType(type: GraphQLInputType): PositionalOptionsType;
}
export {};

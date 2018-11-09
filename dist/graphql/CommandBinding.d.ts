import { Delegate, BindingOptions } from 'graphql-binding';
import { CommandModule } from 'yargs';
export default class CommandBinding extends Delegate {
    commands: CommandModule[];
    constructor({ schema, fragmentReplacements, before }: BindingOptions);
    private mapMutations;
    private buildCommands;
    private buildCommand;
    private buildCommandString;
    private buildCommandArgumentsString;
    private buildDescription;
    private buildCommandArguments;
    private getArgumentType;
    private getArgumentChoices;
}

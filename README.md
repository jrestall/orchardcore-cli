# Orchard Core CLI

> [Orchard Core's](https://www.orchardproject.net) command line interface tool. Use Orchard Core features straight from your CLI.

[![npm](https://img.shields.io/npm/v/orchardcore-cli.svg)](https://www.npmjs.com/package/orchardcore-cli)

[Orchard Core](https://github.com/OrchardCMS/OrchardCore/issues) provides a free, open source, community-focused Content Management System built on the ASP.NET MVC platform.

## Features

The Orchard Core CLI will expose the GraphQL mutations that are available on your Orchard Core server as commands that can be executed from the command line.

[TODO]
Securely login and logout with our [OAuth service](https://orchardcore.readthedocs.io/en/latest/OrchardCore.Modules/OrchardCore.OpenId/README/).

## Installation

Using [npm](http://npmjs.org):

``` sh
npm install -g orchardcore-cli
```

Using [yarn](https://yarnpkg.com):
``` sh
yarn global add orchardcore-cli
```

## Usage

First, you must configure the Orchard Core instance the CLI will manage. You must point it directly to the graphql endpoint.

```bash
$ orchardcore config-cli "https://{your-domain}/graphql" 
```

… then, you can request all available commands for the configured instance:

```bash
$ orchardcore -help
```

… or, see help for a specific command:

```bash
$ orchardcore createTenant -h
```

## Further Support

The documentation can be accessed here: [https://orchardcore.readthedocs.io/en/latest/](https://orchardcore.readthedocs.io/en/latest/)
Exchange with our friendly community on our [forum](https://gitter.im/OrchardCMS/OrchardCore)
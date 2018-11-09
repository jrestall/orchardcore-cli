import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools'

import CommandBinding from './CommandBinding'

function getLink(uri) {
    const http = new HttpLink({ uri: uri, fetch });

    const link = setContext((request, previousContext) => ({
    headers: {
        'Authorization': `Bearer 12345`
    }
    })).concat(http);

    return link;
}

async function getExecutableSchema(link) {
    const schema = await introspectSchema(link);
  
    const executableSchema = makeRemoteExecutableSchema({
      schema,
      link,
    });
  
    return executableSchema;
}

export async function getCommandBinding(uri) : Promise<CommandBinding>
{
    const link = getLink(uri);
    const schema = await getExecutableSchema(link);
    
    // Create the `before` function
    const before = () => console.log(`Sending a request to Orchard Core ...`)

    const binding = new CommandBinding({ schema, before })
    
    return binding;
}


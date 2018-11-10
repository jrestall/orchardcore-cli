using System;  
using System.Threading.Tasks;  
using Microsoft.AspNetCore.NodeServices;  
using Microsoft.Extensions.DependencyInjection;  

namespace OrchardCore.Cli
{
    class Program
    {
        static async Task Main(string[] args)
        { 
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddNodeServices();
  
            var serviceProvider = serviceCollection.BuildServiceProvider();  
            var nodeService = serviceProvider.GetRequiredService<INodeServices>();  

            var output = await ExecuteCommand(nodeService, args);  
  
            Console.WriteLine(output);
        }

        private static async Task<string> ExecuteCommand(INodeServices nodeService, string[] args)  
        {   
            return await nodeService.InvokeAsync<string>("dist/cli-dotnet", args);
        }  
    }
}

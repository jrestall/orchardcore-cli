import { readFile, writeFile } from 'mz/fs'
import { resolve } from 'path'
import { homedir } from 'os'
import findUp from 'find-up'

export interface ConfigOptions {
  host?: string
}

export class Config {
  public static async loadConfig(): Promise<ConfigOptions> {
    const configPath = await this.getConfigPath()
    let configFileContent

    try {
      const content = await readFile(configPath)
      configFileContent = JSON.parse(content.toString())
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e
      }

      configFileContent = {}
    }

    return configFileContent
  }

  public static async saveConfig(configToStore: ConfigOptions) {
    return writeFile(await this.getConfigPath(), JSON.stringify(configToStore, null, 2) + '\n')
  }

  private static async getConfigPath () {
    const configName = '.orchardcore.json'
    let configPath = resolve(homedir(), configName)
    if (!configPath) {
      const nestedConfigPath = await findUp(configName)
      if (nestedConfigPath !== null) {
        configPath = nestedConfigPath
      }
    }
    return configPath
  }
}

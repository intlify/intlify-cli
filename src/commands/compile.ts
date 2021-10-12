import path from 'pathe'
import chalk from 'chalk'
import createDebug from 'debug'
import { CompileErrorCodes, compile } from '../api'
import { t } from '../i18n'

import type { Arguments, Argv } from 'yargs'
import type { DevEnv } from '@intlify/bundle-utils'

const debug = createDebug('@intlify/cli:compile')
const dirname = path.dirname(new URL(import.meta.url).pathname)

type CompileOptions = {
  source: string
  output?: string
  mode?: string
}

export default function defineCommand() {
  const command = 'compile'
  const aliases = 'cp'
  const describe = t('compile the i18n resources')

  const builder = (args: Argv): Argv<CompileOptions> => {
    return args
      .option('source', {
        type: 'string',
        alias: 's',
        describe: t('the i18n resource source path'),
        demandOption: true
      })
      .option('output', {
        type: 'string',
        alias: 'o',
        describe: t('the compiled i18n resource output path')
      })
      .option('mode', {
        type: 'string',
        alias: 'm',
        default: 'production',
        describe: t(
          "the compiled i18n resource mode, 'production' or 'development' (default: 'production')"
        )
      })
  }

  const handler = async (args: Arguments<CompileOptions>): Promise<void> => {
    const output =
      args.output != null ? path.resolve(dirname, args.output) : process.cwd()
    const ret = await compile(args.source, output, {
      mode: args.mode as DevEnv,
      onCompile: (source: string, output: string): void => {
        console.log(
          chalk.green(
            t('Success compilation: {source} -> {output}', { source, output })
          )
        )
      },
      onError: (
        code: number,
        source: string,
        output: string,
        msg?: string
      ): void => {
        switch (code) {
          case CompileErrorCodes.NOT_SUPPORTED_FORMAT:
            const parsed = path.parse(source)
            console.warn(
              chalk.yellow(
                t("{source}: Ignore compilation due to not supported '{ext}'", {
                  named: { ext: parsed.ext }
                })
              )
            )
            break
          case CompileErrorCodes.INTERNAL_COMPILE_WARNING:
            console.log(
              chalk.yellow(
                t('Warning compilation: {source} -> {output}, {msg}', {
                  named: { source, output, msg }
                })
              )
            )
            break
          case CompileErrorCodes.INTERNAL_COMPILE_ERROR:
            console.log(
              chalk.green(
                t('Error compilation: {source} -> {output}, {msg}', {
                  named: { source, output, msg }
                })
              )
            )
            break
          default:
            break
        }
      }
    })
    debug('compile: ', ret)
  }

  return {
    command,
    aliases,
    describe,
    builder,
    handler
  }
}

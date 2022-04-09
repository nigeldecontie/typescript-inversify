import 'dotenv/config'
import 'reflect-metadata'

import { App } from '@web/application'
import { MorganMode } from '@web/lib/abstract-application'

console.clear()

export async function bootstrap() {
  new App({
    containerOpts: {
      defaultScope: 'Singleton',
    },
    morgan: {
      mode: MorganMode.DEV,
    },
  })
}

bootstrap()

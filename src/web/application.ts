import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import { InversifyExpressServer } from 'inversify-express-utils'
import { Container } from 'inversify'

import '@web/controllers/subscribers.controller'
import { DBService } from '@data/db.context'
import { SubscribersRepository } from '@data/subscribers.repository'
import { SubscribersService } from '@logic/services/subscribers.service'
import { BaseHttpResponse } from '@web/lib/base-response'

import {
  AbstractApplicationOptions,
  Application,
} from '@web/lib/abstract-application'
import {
  MissingSubscriberException,
  ValidationException,
} from '@logic/exceptions'

export class App extends Application {
  configureServices(container: Container): void | Promise<void> {
    container.bind(DBService).toSelf()
    container.bind(SubscribersRepository).toSelf()
    container.bind(SubscribersService).toSelf()
  }

  async setup(options: AbstractApplicationOptions) {
    const _db = this.container.get(DBService)

    await _db.connect()

    const server = new InversifyExpressServer(this.container)

    server.setErrorConfig((app) => {
      app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ValidationException) {
          const response = BaseHttpResponse.failed(err.message, 419)
          return res.status(response.statusCode).json(response)
        }

        if (err instanceof MissingSubscriberException) {
          const response = BaseHttpResponse.failed(err.message, 404)
          return res.status(response.statusCode).json(response)
        }

        if (err instanceof Error) {
          const response = BaseHttpResponse.failed(err.message, 500)
          return res.status(response.statusCode).json(response)
        }

        return next()
      })
    })

    server.setConfig((app) => {
      app.use(express.json())
      app.use(morgan(options.morgan.mode))
    })

    const app = server.build()

    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running on http://localhost:${process.env.PORT}/subscribers`
      )
    })
  }
}

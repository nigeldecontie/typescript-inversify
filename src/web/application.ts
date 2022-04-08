import express, { Request, Response, NextFunction } from 'express'
import { InversifyExpressServer } from 'inversify-express-utils'
import { Container } from 'inversify'

import { DBService } from '@data/db.context'
import { Application } from './lib/abstract-application'
import { SubscribersRepository } from '@data/subscribers.repository'
import { SubscribersService } from '@logic/subscribers.service'

import '@web/controllers/subscribers.controller'
import {
  MissingSubscriberException,
  ValidationException,
} from '@logic/exceptions'
import { BaseHttpResponse } from '@web/lib/base-response'

export class App extends Application {
  configureServices(container: Container): void | Promise<void> {
    container.bind(DBService).toSelf()
    container.bind(SubscribersRepository).toSelf()
    container.bind(SubscribersService).toSelf()
  }
  async setup() {
    const _db = this.container.get(DBService)

    await _db.connect()

    const server = new InversifyExpressServer(this.container)

    server.setErrorConfig((app) => {
      app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ValidationException) {
          const response = BaseHttpResponse.failed(err.message, 419)
          res.status(response.statusCode).json(response)
        }

        if (err instanceof MissingSubscriberException) {
          const response = BaseHttpResponse.failed(err.message, 404)
          res.status(response.statusCode).json(response)
        }

        return next()
      })
    })

    server.setConfig((app) => {
      app.use(express.json())
    })

    const app = server.build()

    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running on http://localhost:${process.env.PORT}/subscribers`
      )
    })
  }
}

import { Request, Response, NextFunction } from 'express'
import { BaseMiddleware } from '@web/lib/base-middleware'

export class ValidateRequestMiddleware extends BaseMiddleware {
  constructor(
    private readonly _DtoClass: { from: any },
    private readonly _withParams = false
  ) {
    super()
  }

  public execute(
    req: Request,
    _: Response,
    next: NextFunction
  ): void | Promise<void> {
    if (this._withParams) {
      req.body = {
        ...req.body,
        ...req.params,
      }
    }

    req.body = this._DtoClass.from(req.body)

    return next()
  }

  static with(dto: any) {
    return new ValidateRequestMiddleware(dto, false).execute
  }

  static withParams(dto: any) {
    return new ValidateRequestMiddleware(dto, true).execute
  }
}

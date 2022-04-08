import { ValidationException } from '@logic/exceptions'
import { HttpException } from '@web/exceptions/http-exception'

export class CreateSubscriberDto {
  constructor(public readonly name: string, public readonly channel: string) {}

  static from(body: Partial<CreateSubscriberDto>) {
    if (!body.channel) {
      throw new ValidationException(`Missing property channel`)
    }

    if (!body.name) {
      throw new ValidationException(`Missing property name`)
    }

    return new CreateSubscriberDto(body.name, body.channel)
  }
}

import { injectable } from 'inversify'
import { SubscribersRepository } from '@data/subscribers.repository'
import {
  CreateSubscriberDto,
  SingleSubscriberDto,
  SubscriberDto,
  UpdateSubscriberDto,
} from '@logic/dtos'

@injectable()
export class SubscribersService {
  constructor(private readonly _subscribersRepo: SubscribersRepository) {}

  async all() {
    const subscribers = await this._subscribersRepo.all()
    return SubscriberDto.fromMany(subscribers)
  }

  async findOne(singleSubscriberDto: SingleSubscriberDto) {
    const foundSubscriber = await this._subscribersRepo.findOne(
      singleSubscriberDto.id
    )

    if (!foundSubscriber) {
      throw new Error(`No subscriber found with the given id.`)
    }

    return SubscriberDto.from(foundSubscriber)
  }

  async create(createSubscriberDto: CreateSubscriberDto) {
    const createdSubscriber = await this._subscribersRepo.create(
      createSubscriberDto
    )
    return SubscriberDto.from(createdSubscriber)
  }

  async updateOne(updateSubscriberDto: UpdateSubscriberDto) {
    return this._subscribersRepo.updateOne({
      _id: updateSubscriberDto.id,
      name: updateSubscriberDto.name,
      channel: updateSubscriberDto.channel,
    })
  }

  async deleteOne({ id }: SingleSubscriberDto) {
    return await this._subscribersRepo.deleteOne(id)
  }
}

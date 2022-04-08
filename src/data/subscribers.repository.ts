import { injectable } from 'inversify'
import { DBService } from './db.context'
import { ISubscriber } from './subscribers.model'

@injectable()
export class SubscribersRepository {
  constructor(private readonly _dbContext: DBService) {}

  async all() {
    return this._dbContext.subscriber.find({})
  }

  async findOne(id: string) {
    return this._dbContext.subscriber.findById(id).catch(() => null)
  }

  async create(entity: Partial<ISubscriber>) {
    return this._dbContext.subscriber.create(entity)
  }

  async updateOne(payload: Partial<ISubscriber>) {
    const foundSubscriber = await this._dbContext.subscriber.findById(
      payload._id
    )

    if (!foundSubscriber) {
      throw new Error('subscriber does not exist')
    }

    if (payload.name) foundSubscriber.name = payload.name
    if (payload.channel) foundSubscriber.channel = payload.channel

    return foundSubscriber.save()
  }

  async deleteOne(id: string) {
    return this._dbContext.subscriber.deleteOne({ _id: id })
  }
}

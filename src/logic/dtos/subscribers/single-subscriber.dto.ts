export class SingleSubscriberDto {
  constructor(public readonly id: string) {}

  static from(body: Partial<SingleSubscriberDto>) {
    if (!body.id) {
      throw new Error(`Missing id property`)
    }

    return new SingleSubscriberDto(body.id)
  }
}

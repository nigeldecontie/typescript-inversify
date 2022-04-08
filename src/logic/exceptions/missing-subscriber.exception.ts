export class MissingSubscriberException extends Error {
  constructor() {
    super(`Missing subscriber.`)
  }
}

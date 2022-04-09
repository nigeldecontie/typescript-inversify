import { Container, interfaces } from 'inversify'

export enum MorganMode {
  DEV = 'dev',
  COMMON = 'common',
  TINY = 'tiny',
  SHORT = 'short',
  COMBINED = 'combined',
}

export interface AbstractApplicationOptions {
  containerOpts: interfaces.ContainerOptions
  morgan: {
    mode: MorganMode
  }
}

export abstract class Application {
  protected readonly container: Container

  constructor(options: AbstractApplicationOptions) {
    this.container = new Container(options.containerOpts)
    this.configureServices(this.container)
    this.setup(options)
  }

  abstract configureServices(container: Container): Promise<void> | void
  abstract setup(options: AbstractApplicationOptions): Promise<void> | void
}

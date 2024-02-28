export function time(target, descriptor) {
  console.log({ descriptor }, { target })
  if (descriptor.kind !== 'method') throw new Error(`expected ${descriptor.name} to be a method`)
  descriptor.addInitializer(function () {
    pubsub.subscribe('time-interval', (value) => {
      this.onTimeChange?.(value)
    })
  })
}

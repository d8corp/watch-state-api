global.BroadcastChannel = global.BroadcastChannel || function () {
  this.addEventListener = () => {}
  this.postMessage = () => {}
  this.close = () => {}
} as any

global.BroadcastChannel = global.BroadcastChannel || function () {
    this.onmessage = () => { };
    this.postMessage = () => { };
    this.close = () => { };
};

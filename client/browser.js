const Base = require('./base')

class WSClient extends Base {
  constructor (endpoint, options = {}) {
    super(options)
    this.client = new WebSocket(endpoint, 'fast-ws')
    this.client.onerror = error => {
      this.emit('error', error)
    }
    this.client.onopen = () => {
      this.connectState = 1
      this.emit('open')
      this._heartbeat = setInterval(() => {
        this.ping()
      }, options.pingInterval || 30000)
    }
    this.client.onclose = () => {
      this.emit('close')
      this.connectState = -1
      clearInterval(this._heartbeat)
      this.emit('disconnect')
    }
    this.client.onmessage = ({ type, data }) => {
      if (this.connectState !== 2) {
        if (data === '\x00\x02') {
          this.connectState = 2
          this.emit('connect')
        } else {
          this.emit('error', new Error('Client version mismatch.'))
        }
      } else {
        this.incomingPacket(data)
      }
    }
  }

  ping () {
    this.client.send(Base.getPayload(null, 'ping'))
  }
}

module.exports = WSClient

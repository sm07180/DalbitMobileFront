export class HostMediaHandler {
  constructor(socketUrl, stream) {
    this.url = socketUrl
    this.ws = null
    this.micStream = stream
    this.streamId = null
    this.rtcPeerConn = null
    this.rtcDescription = null
    this.iceCandidate = []

    this.intervalId = null
  }

  setMicStream(stream) {
    this.micStream = stream
  }
  setStreamId(id) {
    this.streamId = id
  }
  setRtcPeerConn(conn) {
    this.rtcPeerConn = conn
  }

  socketSendMsg(data) {
    this.ws.send(JSON.stringify(data))
  }
  wSocketInit() {
    this.ws = new WebSocket(this.url)
    this.ws.onopen = () => {
      if (this.intervalId) {
        // Clear retry websocket interval
        clearInterval(this.intervalId)
        this.intervalId = null
      }
      const pingIntervalSec = 3000
      // Ping websocket interval
      this.intervalId = setInterval(() => {
        const cmd = {
          command: 'ping'
        }
        this.socketSendMsg(cmd)
      }, pingIntervalSec)
    }
    this.ws.onclose = () => {
      if (this.intervalId) {
        // Clear ping websocket interval
        clearInterval(pingIntervalId)
      }
      const retryIntervalSec = 3000
      // Retry websocket interval
      this.intervalId = setInterval(() => {
        this.wSocketInit()
      }, retryIntervalSec)
    }
    this.ws.onmessage = msg => {
      const format = JSON.parse(msg.data)
      const {command} = format
      switch (command) {
        case 'start': {
          break
        }
        case 'stop': {
          break
        }
        case 'takeCandidate': {
          break
        }
        case 'takeConfiguration': {
          break
        }
        case 'error': {
          break
        }
        case 'notification': {
          break
        }
        case 'streamInformation': {
          break
        }
        case 'pong': {
          break
        }
        default: {
          break
        }
      }
    }
    this.ws.onerror = () => {}
  }
}

export const wSocketHandler = socketUrl => {
  const url = socketUrl
  const ws = new WebSocket(url)
  let streamId = null
  let micStream = null
  let rtcPeerConn = null
  let rtcDescription = false
  let iceCandidate = null

  let retryIntervalId = null
  let pingIntervalId = null

  const msgToString = json => JSON.stringify(json)
  const takeCandidate = (streamId, label, candidate) => {}
  const takeConfiguration = () => {}
  const initPeerConnection = micStream => {
    rtcPeerConn = new RTCPeerConnection()
    iceCandidate = []
    // rtcPeerConn.addTrack(micStream)
    rtcPeerConn.onicecandidate = e => {}
    rtcPeerConn.ontrack = e => {}
  }
  const closePeerConnection = () => {
    if (rtcPeerConn) {
      rtcPeerConn.close()
      rtcPeerConn = null
    }
  }
  const addIceCandidate = candidate => {
    rtcPeerConn.addIceCandidate(candidate).then(res => console.log(res))
  }
  const startPublishing = async streamId => {
    const sdp_constraints = {
      OfferToReceiveAudio: false,
      OfferToReceiveVedio: false
    }
    if (rtcPeerConn) {
      const config = await rtcPeerConn.createOffer(sdp_constraints)
      await rtcPeerConn.setLocalDescription(config).then(() => {
        const cmd = {
          command: 'takeConfiguration',
          streamId,
          type: config.type,
          sdp: config.sdp
        }
        ws.send(msgToString(cmd))
      })
    }
  }

  const joinRoom = (streamId, roomName) => {
    const cmd = {
      command: 'joinRoom',
      streamId: streamId,
      room: roomName
    }

    ws.send(msgToString(cmd))
  }
  const leaveFromRoom = roomName => {}
  const leave = streamId => {}
  const setInitValueAsNull = () => {
    streamId = null
    micStream = null
  }

  ws.publish = (id, stream, token) => {
    streamId = id
    micStream = stream
    const cmd = {
      command: 'publish',
      streamId,
      token: null,
      audio: micStream.getAudioTracks().length ? true : false,
      video: micStream.getVideoTracks().length ? true : false
    }
    ws.send(msgToString(cmd))
  }

  ws.stopPublish = () => {
    const cmd = {
      command: 'stop',
      streamId
    }

    ws.send(msgToString(cmd))
    setInitValueAsNull()
  }

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      if (retryIntervalId) {
        clearInterval(retryIntervalId)
      }
      const pingIntervalSec = 3000
      pingIntervalId = setInterval(() => {
        const cmd = {
          command: 'ping'
        }
        ws.send(msgToString(cmd))
      }, pingIntervalSec)
      resolve(ws)
    }
    ws.onclose = () => {
      ws.close()
      if (pingIntervalId) {
        clearInterval(pingIntervalId)
      }
      const retryIntervalSec = 3000
      retryIntervalId = setInterval(() => {}, retryIntervalSec)
    }
    ws.onmessage = msg => {
      const format = JSON.parse(msg.data)
      const {command} = format
      switch (command) {
        case 'start': {
          break
        }
        case 'stop': {
          break
        }
        case 'takeCandidate': {
          break
        }
        case 'takeConfiguration': {
          break
        }
        case 'error': {
          break
        }
        case 'notification': {
          break
        }
        case 'streamInformation': {
          break
        }
        case 'pong': {
          break
        }
        default: {
          break
        }
      }
    }
    ws.onerror = () => {}
  })
}

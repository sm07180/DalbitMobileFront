export class SignalingHandler {
  constructor(socketUrl, stream, debug) {
    this.url = socketUrl
    this.ws = null
    this.micStream = stream
    this.streamId = null
    this.token = null
    this.room = null
    this.rtcPeerConn = null
    this.rtcDescription = null
    this.iceCandidate = []
    this.debug = debug ? debug : false
    this.sdpConstraints = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    }

    this.intervalId = null
    this.wSocketInit()
  }

  setMicStream(stream) {
    this.micStream = stream
  }
  setStreamId(id) {
    this.streamId = id
  }

  socketSendMsg(data) {
    this.ws.send(JSON.stringify(data))
  }

  /**
   * about websocket command method
   */
  publish() {
    const cmd = {
      command: 'publish',
      streamId: this.streamId,
      token: this.token,
      audio: this.micStream.getAudioTracks().length > 0 ? true : false,
      video: false
    }
    this.socketSendMsg(cmd)
  }
  joinRoom(roomName) {
    this.room = roomName
    const cmd = {
      command: 'joinRoom',
      streamId: this.streamId,
      room: this.room
    }
    this.socketSendMsg(cmd)
  }
  play() {
    const cmd = {
      command: 'play',
      streamId: this.streamdId,
      token: this.token,
      room: this.room
    }
    this.socketSendMsg(cmd)
  }
  stop() {
    this.closePeerConnection()
    const cmd = {
      command: 'stop',
      streamId: this.streamId
    }
    this.socketSendMsg(cmd)
  }
  join() {
    const cmd = {
      command: 'join',
      streamId: this.streamId
    }
    this.socketSendMsg(cmd)
  }

  /**
   * about webrtc command method
   */
  iceCandidateReceived(event) {
    if (event.candidate) {
      const {candidate} = event
      const cmd = {
        command: 'takeCandidate',
        streamId: this.streamId,
        label: candidate.sdpMLineIndex,
        id: candidate.sdpMid,
        candidate: candidate.candidate
      }
      if (this.debug) {
        console.log('sending ice candiate for stream Id ' + this.streamId)
        console.log(JSON.stringify(event.candidate))
      }
      this.socketSendMsg(cmd)
    }
  }
  initPeerConnection() {
    if (!this.rtcPeerConn) {
      this.rtcPeerConn = new RTCPeerConnection()
      this.rtcDescription = false
      this.iceCandidate = []
      this.rtcPeerConn.addTrack(this.micStream.getAudioTracks()[0])
      this.rtcPeerConn.onicecandidate = e => {
        this.iceCandidateReceived(e)
      }
      this.rtcPeerConn.ontrack = e => {}
    }
  }
  closePeerConnection() {
    if (!this.rtcPeerConn && this.rtcPeerConn.signalingState !== 'closed') {
      this.rtcPeerConn.close()
      this.rtcPeerConn = null
    }
  }
  gotDescription = config => {
    this.rtcPeerConn
      .setLocalDescription(config)
      .then(() => {
        const cmd = {
          command: 'takeConfiguration',
          streamId: this.streamId,
          type: config.type,
          sdp: config.sdp
        }

        this.socketSendMsg(cmd)
      })
      .catch(err => console.log('Cannot set local description ' + err))
  }
  takeConfiguration(_sdp, _type) {
    this.rtcPeerConn
      .setRemoteDescription(
        new RTCSessionDescription({
          sdp: _sdp,
          type: _type
        })
      )
      .then(() => {
        this.rtcDescription = true
        this.iceCandidate.forEach(candidate => {
          this.addIceCandidate(candidate)
        })
        this.iceCandidate = []

        if (_type === 'offer') {
          this.rtcPeerConn
            .createAnswer(this.sdpConstraints)
            .then(config => this.gotDescription(config))
            .catch(err => console.error('create answer error'))
        }
      })
      .catch(err => {
        if (this.debug) {
          console.error('set remote description is failed with error: ' + error)
        }
      })
  }
  takeCandidate(_label, _candidate) {
    const candidate = new RTCIceCandidate({
      sdpMLineIndex: _label,
      candidate: _candidate
    })
    if (this.rtcDescription) {
      this.addIceCandidate(candidate)
    } else {
      this.iceCandidate.push(candidate)
    }
  }
  addIceCandidate(candidate) {
    this.rtcPeerConn.addIceCandidate(candidate)
  }
  startPublishing() {
    this.initPeerConnection()
    this.rtcPeerConn
      .createOffer(this.sdpConstraints)
      .then(config => {
        this.gotDescription(config)
      })
      .catch(err => console.log(err))
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
          this.startPublishing()
          break
        }
        case 'play': {
        }
        case 'stop': {
          this.closePeerConnection()
          break
        }
        case 'takeCandidate': {
          const {label, candidate} = format
          this.takeCandidate(label, candidate)
          break
        }
        case 'takeConfiguration': {
          const {sdp, type} = format
          this.takeConfiguration(sdp, type)
          break
        }
        case 'notification': {
          const {definition} = format
          if (definition === 'play_started') {
            console.log('Guest Play started')
          } else if (definition === 'play_finished') {
            console.log('Guest Play Stopped')
          } else if (definition === 'publish_finished') {
          }
          break
        }
        case 'streamInformation': {
          break
        }
        case 'error': {
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

export class Host extends SignalingHandler {
  constructor(socketUrl, stream, debug) {
    super(socketUrl, stream, debug)
  }
}
export class Guest extends SignalingHandler {
  constructor(socketUrl, stream, debug) {
    super(socketUrl, stream, debug)
  }
}

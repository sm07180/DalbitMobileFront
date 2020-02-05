export class SignalingHandler {
  constructor(socketUrl, stream, audioTag, debug) {
    this.url = socketUrl
    this.ws = null
    this.micStream = stream
    this.streamId = null
    this.token = null
    this.room = null
    this.rtcPeerConn = null
    this.rtcDescription = null
    this.iceCandidate = []
    this.audioTag = audioTag
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
  stop() {
    this.closePeerConnection()
    const cmd = {
      command: 'stop',
      streamId: this.streamId
    }
    this.socketSendMsg(cmd)

    // guest stop
    if (this.audioTag && this.audioTag.srcObject) {
      this.audioTag.pause()
      this.audioTag.srcObject = null
    }
  }
  join() {
    const cmd = {
      command: 'join',
      streamId: this.streamId
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
  leave() {
    const cmd = {
      command: 'leave',
      streamId: this.streamId
    }
    this.socketSendMsg(cmd)
    this.closePeerConnection()
  }
  leaveFromRoom() {
    const cmd = {
      command: 'leaveFromRoom',
      room: this.room
    }
    this.socketSendMsg(cmd)
    this.room = null
  }
  getStreamInfo() {
    const cmd = {
      command: 'getStreamInfo',
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
      if (this.type === 'host') {
        this.rtcPeerConn.addTrack(this.micStream.getAudioTracks()[0])
      }
      this.rtcPeerConn.onicecandidate = e => {
        this.iceCandidateReceived(e)
      }
      this.rtcPeerConn.ontrack = e => {
        if (!this.audioTag.srcObject) {
          this.audioTag.srcObject = e.streams[0]
        }
      }
    }
  }
  closePeerConnection() {
    if (this.rtcPeerConn && this.rtcPeerConn.signalingState !== 'closed') {
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

        // guest case
        if (_type === 'offer') {
          this.rtcPeerConn
            .createAnswer(this.sdpConstraints)
            .then(config => this.gotDescription(config))
            .catch(err => console.error('create answer error' + err))
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
  startPlaying() {
    this.initPeerConnection()
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
          } else if (definition === 'play_finished' || definition === 'publish_finished') {
            this.stop()
          }
          break
        }
        case 'streamInformation': {
          break
        }
        case 'error': {
          const {definition} = format
          alert(JSON.stringify(definition))
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
    this.type = 'host'
  }
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
}
export class Guest extends SignalingHandler {
  constructor(socketUrl, stream, debug) {
    super(socketUrl, stream, debug)
    this.type = 'guest'
  }
  play() {
    const cmd = {
      command: 'play',
      streamId: this.streamId,
      token: this.token,
      room: this.room
    }
    this.socketSendMsg(cmd)
    this.startPlaying()
  }
}

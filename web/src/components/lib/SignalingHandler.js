const audioSocketUrl = 'wss://v154.dalbitcast.com:5443/WebRTCAppEE/websocket'

export default class SignalingHandler {
  constructor(debug) {
    this.url = audioSocketUrl
    this.ws = null
    this.streamId = null
    this.publishToken = null
    this.playToken = null
    this.room = null
    this.rtcPeerConn = null
    this.guestRtcPeerConn = null
    this.rtcDescription = null
    this.iceCandidate = []
    this.debug = debug ? debug : false
    this.sdpConstraints = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    }

    this.audioTag = document.createElement('audio')
    this.audioTag.autoplay = true

    // host, guest, listener
    this.type = null

    // host, guest
    this.audioStream = null

    this.connectedHostImage = null

    // callback
    this.localStartCallback = null
    this.localStopCallback = null
    this.globalStartCallback = null
    this.globalStopCallback = null

    // about socket info
    this.intervalId = null
    this.wSocketInit()
  }

  async setType(type) {
    this.type = type
    if (this.type === 'host' || this.type === 'guest') {
      await this.setAudioStream()
    }
  }
  setStreamId(id) {
    this.streamId = id
  }
  setLocalStartCallback(callback) {
    this.localStartCallback = callback
  }
  setLocalStopCallback(callback) {
    this.localStopCallback = callback
  }
  setGlobalStartCallback(callback) {
    this.globalStartCallback = callback
  }
  setGlobalStopCallback(callback) {
    this.globalStopCallback = callback
  }
  resetLocalCallback() {
    this.localStartCallback = null
    this.localStopCallback = null
  }
  resetGlobalCallback() {
    this.globalStartCallback = null
    this.globalStopCallback = null
  }
  setAudioTag(audioTag) {
    this.audioTag = audioTag
  }
  setHostImage(img) {
    this.connectedHostImage = img
  }

  async detectAudioDevice() {
    const devices = await navigator.mediaDevices.enumerateDevices()
    let micExist = false
    devices.forEach(d => {
      if (d.kind === 'audioinput') {
        micExist = true
      }
    })

    if (!micExist) {
      if (this.audioStream) {
        this.removeAudioStream()
        this.stop()
      }
    } else {
      if (!this.audioStream && this.type === 'host') {
        await this.setAudioStream()
      }
    }
  }

  async setAudioStream() {
    navigator.mediaDevices.addEventListener('devicechange', this.detectAudioDevice)

    const constraint = {audio: true}
    await navigator.mediaDevices
      .getUserMedia(constraint)
      .then(stream => {
        this.audioStream = stream
      })
      .catch(e => {
        if (String(e).indexOf('Permission') !== -1) {
          // alert('Mic permission is denied')
        } else if (String(e).indexOf('NotFound') !== -1) {
          // alert('Mic is not found')
        }
      })
  }

  removeAudioStream() {
    navigator.mediaDevices.removeEventListener('devicechange', this.detectAudioDevice)
    this.audioStream.getTracks().forEach(track => {
      track.stop()
    })
    this.audioStream = null
  }

  socketSendMsg(data) {
    this.ws.send(JSON.stringify(data))
  }

  /**
   * about websocket command method
   */
  publish() {
    if (this.type !== 'host') {
      return alert('Not host!')
    }
    if (!this.audioStream) {
      return alert('Need a audio stream')
    }

    const cmd = {
      command: 'publish',
      streamId: this.streamId,
      token: this.publishToken,
      audio: this.audioStream.getAudioTracks().length > 0 ? true : false,
      video: false
    }
    this.socketSendMsg(cmd)
  }

  play() {
    if (this.type !== 'listener') {
      return alert('Not listener!')
    }
    if (!this.audioTag) {
      return alert('Need a audio tag')
    }
    const cmd = {
      command: 'play',
      streamId: this.streamId,
      token: this.playToken,
      room: this.room
    }
    this.socketSendMsg(cmd)
    this.startPlaying()
    return true
  }

  stop() {
    this.closePeerConnection()
    const cmd = {
      command: 'stop',
      streamId: this.streamId
    }
    this.socketSendMsg(cmd)

    this.connectedHostImage = null

    // listener stop
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
        if (this.audioStream) {
          const audioTrack = this.audioStream.getAudioTracks()[0]
          this.rtcPeerConn.addTrack(audioTrack)
        }
      }
      this.rtcPeerConn.onicecandidate = e => {
        this.iceCandidateReceived(e)
      }
      this.rtcPeerConn.ontrack = e => {
        if (this.audioTag && !this.audioTag.srcObject) {
          this.audioTag.srcObject = e.streams[0]
        }
      }

      if (this.globalStartCallback) {
        this.globalStartCallback()
      }
    }
  }
  closePeerConnection() {
    if (this.rtcPeerConn && this.rtcPeerConn.signalingState !== 'closed') {
      this.rtcPeerConn.close()
      this.rtcPeerConn = null
      this.rtcDescription = false
      this.iceCandidate = []
    }

    if (this.localStopCallback) {
      this.localStopCallback()
    }
    if (this.globalStopCallback) {
      this.globalStopCallback()
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

        // listener case
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
    if (!this.ws) {
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
          clearInterval(this.intervalId)
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
            this.closePeerConnection()
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
}

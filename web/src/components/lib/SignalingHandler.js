const audioSocketUrl = __WEBRTC_SOCKET_URL

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
    this.audioTag.muted = false

    // host, guest, listener
    this.type = null

    // host, guest
    this.audioStream = null

    // callback
    this.localStartCallback = null
    this.localStopCallback = null
    this.globalStartCallback = null
    this.globalStopCallback = null

    // global context(for alert ui)
    this.context = null

    // about socket info
    this.intervalId = null
    this.wSocketInit()

    //audioVolume
    let audioSource = null
    let audioDestination = null
  }

  async setType(type) {
    this.type = type
    if (this.type === 'host' || this.type === 'guest') {
      await this.setAudioStream()
    }
  }
  setPublishToken(token) {
    this.publishToken = token
  }
  setPlayToken(token) {
    this.playToken = token
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

  setContext(context) {
    this.context = context
  }
  //오디오 볼륨 생성
  setAudioVolumeMake() {
    if (!this.audioStream) {
      return
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext
    let audioContext = new AudioContext()

    let gainNode = audioContext.createGain()
    audioSource = audioContext.createMediaStreamSource(this.audioStream)
    audioDestination = audioContext.createMediaStreamDestination()
    audioSource.connect(gainNode)
    gainNode.connect(audioDestination)
    audioVolume = gainNode.gain.value
    setAudioTag(gainNode)
    //console.log('초기 볼륨 크기 = ' + audioVolume)
  }
  getAudioVolume = () => {
    //console.log('getAudioVolume = ' + this.audioTag.volume)
    return this.audioTag.volume
  }
  setAudioVolume = value => {
    if (Number(value) > 1 || Number(value) < 0) return
    console.log('볼륨 크기 = ' + value)
    if (this.audioTag) this.audioTag.volume = value
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
      .then(() => {
        //오디오 볼륨
        //this.setAudioVolumeMake()
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
      audio: this.audioStream && this.audioStream.getAudioTracks().length > 0 ? true : false,
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
    if (!this.streamId) {
      return alert('Need a stream Id!')
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

    // listener stop
    if (this.audioTag && this.audioTag.srcObject) {
      this.audioTag.pause()
      this.audioTag.srcObject = null
    }
  }

  setMuted(status) {
    //this.audioTag.muted = status
    // 전체 마이크랑 배경 음악도 지워진다.
    if (this.audioStream) {
      const track = this.audioStream.getAudioTracks()[1]
      if (track) track.enabled = status
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

          // var context = new window.AudioContext()
          // var microphone = context.createMediaStreamSource(this.audioStream)
          // var gainFilter = context.createGain()
          // var destination = context.createMediaStreamDestination()
          // this.audioStream = destination.stream
          // microphone.connect(gainFilter)
          // gainFilter.connect(destination)
          // var filteredTrack = this.audioStream.getAudioTracks()[1]
          // this.rtcPeerConn.addTrack(filteredTrack)
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
    }
    this.rtcPeerConn = null
    this.rtcDescription = false
    this.iceCandidate = []

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
              if (!this.rtcPeerConn) {
                this.stop()
              }
            }
            break
          }
          case 'streamInformation': {
            break
          }
          case 'error': {
            const {definition} = format
            // alert(JSON.stringify(definition))
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

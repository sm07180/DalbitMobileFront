/**
 * @brief 마이크체크
 */
export const getMicStream = async () => {
  const constraint = {audio: true}
  let mediaStream = null

  const detectAudioDevice = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    let micExist = false
    devices.forEach(d => {
      if (d.kind === 'audioinput') {
        micExist = true
      }
    })
    if (!micExist) {
      alert('Mic is discnnected')
    }
  }

  navigator.mediaDevices.ondevicechange = detectAudioDevice

  await navigator.mediaDevices
    .getUserMedia(constraint)
    .then(async stream => {
      mediaStream = stream
    })
    .catch(e => {
      if (String(e).indexOf('Permission') !== -1) {
        // alert('Mic permission is denied')
      } else if (String(e).indexOf('not found') !== -1) {
        // alert('Mic is not found')
      }
    })
  return mediaStream
}

export const removeMicStream = stream => {
  navigator.mediaDevices.ondevicechange = null
  stream.getTracks().forEach(track => {
    track.stop()
  })
}

export const wSocketHandler = socketUrl => {
  const url = socketUrl
  const ws = new WebSocket(url)
  let rtcPeerConn = null
  let rtcDescription = false
  let iceCandidate = null

  const msgToString = json => JSON.stringify(json)
  let retryIntervalId = null
  let pingIntervalId = null

  const takeCandidate = (streamId, label, candidate) => {}
  const takeConfiguration = () => {}
  const initPeerConnection = micStream => {
    rtcPeerConn = new RTCPeerConnection()
    iceCandidate = []
    // rtcPeerConn.addStream(micStream)
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

  ws.publish = (streamId, token) => {
    const cmd = {
      command: 'publish',
      streamId,
      token,
      audio: true ? true : false,
      video: true ? true : false
    }
    ws.send(msgToString(cmd))
  }

  ws.joinRoom = (streamId, roomName) => {
    const cmd = {
      command: 'joinRoom',
      streamId: streamId,
      room: roomName
    }

    ws.send(msgToString(cmd))
  }

  ws.leaveRoom = roomName => {}

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

import {resolveComponents} from 'uri-js'

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

  await navigator.mediaDevices
    .getUserMedia(constraint)
    .then(async stream => {
      mediaStream = stream
      navigator.mediaDevices.ondevicechange = detectAudioDevice
    })
    .catch(e => {
      if (String(e).indexOf('Permission') !== -1) {
        alert('Mic permission is denied')
      } else if (String(e).indexOf('not found') !== -1) {
        alert('Mic is not found')
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
  const ws = new WebSocket(socketUrl)

  const msgTostring = json => JSON.stringify(json)

  ws.publish = (streamId, token) => {
    const cmd = {
      command: 'publish',
      streamId,
      token,
      audio: true ? true : false,
      video: true ? true : false
    }
    ws.send(msgTostring(cmd))
  }

  ws.joinRoom = (streamId, roomName) => {
    const cmd = {
      command: 'joinRoom',
      streamId: streamId,
      room: roomName
    }

    ws.send(msgTostring(cmd))
  }

  ws.leaveRoom = roomName => {}

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      resolve(ws)
    }
    ws.onclose = () => ws.close()
    ws.onmessage = msg => {
      const format = JSON.parsed(msg)
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

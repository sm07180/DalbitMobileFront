/**
 * @brief 마이크체크
 */

// https://howlerjs.com/
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
    stream.removeTrack(track)
  })
}

export const getAudioStream = async tag => {
  const audioTag = await new Promise((resolve, reject) => {
    tag.onloadeddata = () => {
      console.log('loaded', tag)
      resolve(tag)
    }
  })
  const audioCtx = new AudioContext()
  const source = audioCtx.createMediaElementSource(audioTag)
  source.connect(audioCtx.destination)
  const {stream} = audioCtx.createMediaStreamDestination()
  return stream
}

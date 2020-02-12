/**
 * @brief 마이크체크
 */

// https://howlerjs.com/
export const getAudioStream = async () => {
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
      alert('Mic is disconnected')
    }
  }

  navigator.mediaDevices.ondevicechange = detectAudioDevice

  await navigator.mediaDevices
    .getUserMedia(constraint)
    .then(stream => {
      mediaStream = stream
    })
    .catch(e => {
      if (String(e).indexOf('Permission') !== -1) {
        // alert('Mic permission is denied')
      } else if (String(e).indexOf('NotFound') !== -1) {
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

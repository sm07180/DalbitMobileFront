/**
 * @brief 마이크체크
 */

// https://howlerjs.com/

const detectAudioDevice = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices()
  let micExist = false
  devices.forEach(d => {
    if (d.kind === 'audioinput') {
      micExist = true
    }
  })

  if (!micExist) {
    // alert('Mic is disconnected')
  }
}

export const getAudioStream = async () => {
  const constraint = {audio: true}
  let mediaStream = null

  navigator.mediaDevices.addEventListener('devicechange', detectAudioDevice)

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

export const removeAudioStream = stream => {
  navigator.mediaDevices.removeEventListener('devicechange', detectAudioDevice)
  stream.getTracks().forEach(track => {
    track.stop()
  })
}

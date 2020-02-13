// return Promise
export const getAudioDeviceCheck = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices()
  let micExist = false
  devices.forEach(d => {
    if (d.kind === 'audioinput') {
      micExist = true
    }
  })

  return micExist
}

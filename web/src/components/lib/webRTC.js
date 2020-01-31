import React from 'react'
import $ from 'jquery'
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

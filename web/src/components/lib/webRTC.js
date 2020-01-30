import React from 'react'
import $ from 'jquery'
/**
 * @brief 마이크체크
 */
export const checkMic = async () => {
  const constraint = {audio: true, video: false}
  let mediaStream = null

  await navigator.mediaDevices
    .getUserMedia(
      constraint,

      // success callback
      async () => {
        // check if mic is provided
        await navigator.mediaDevices
          .enumerateDevices()
          .then(devices => {
            devices.forEach(device => {
              if (device.kind === 'audioinput') {
                console.log('mic', device)
              }
            })
          })
          .catch(err => {
            console.log(err.name + ': ' + error.message)
          })
      },
      // error callback
      () => {
        alert('Mic is not connected.')
      }
    )
    .then(stream => {
      mediaStream = stream
    })
    .catch(e => {})
  return mediaStream
}

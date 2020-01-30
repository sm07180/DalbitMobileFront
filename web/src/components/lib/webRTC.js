import React from 'react'
import $ from 'jquery'
/**
 * @brief 마이크체크
 */
export const checkMic = async () => {
  const constraint = {audio: true, video: false}
  let mediaStream = null

  const streamHandler = () => {
    ;() => {
      // check if mic is provided
      navigator.mediaDevices
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
    }
  }

  const errorHandler = () => {
    alert('Mic is not connected.')
  }

  await navigator.mediaDevices
    .getUserMedia(constraint, streamHandler, errorHandler)
    .then(stream => {
      mediaStream = stream
    })
    .catch(e => alert(e))
  return mediaStream
}

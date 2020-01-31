import React from 'react'
import $ from 'jquery'
/**
 * @brief 마이크체크
 */
export const checkMic = async () => {
  const constraint = {audio: true, video: false}
  let mediaStream = null

  await navigator.mediaDevices
    .getUserMedia(constraint)
    .then(stream => {
      mediaStream = stream
    })
    .catch(e => alert('Mic permission is denied.'))
  return mediaStream
}

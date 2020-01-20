import React from 'react'
import $ from 'jquery'
/**
 * @brief  ; 마이크체크
 */
export const checkMic = () => {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      {video: true, audio: true},
      function() {
        // Success
        // check if mic is provided
        navigator.mediaDevices
          .enumerateDevices()
          .then(function(devices) {
            devices.forEach(function(device) {
              //if mic is plugged in
              if ((device.kind === 'audioinput' && device.kind === 'videoinput') || device.kind === 'audioinput') {
                //check if mic has permission
                alert('마이크연결이 아주잘됬습니다!!')
                if (device.label.length > 0) {
                  //go to chat room
                }
              }
            })
          })
          .catch(function(err) {
            //console.log(err.name + ': ' + error.message)
          })
      },
      function() {
        alert('마이크연결이 전혀 안됬는데용?!!')
      }
    )
  }
}

/**
 * @brief  ; 마이크체크
 */

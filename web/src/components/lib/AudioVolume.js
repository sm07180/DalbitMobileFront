/**
 * @brief 방송방 오디오 볼륨을 얻어 오기 위한 라이브러리 -> SignalingHandle에 추가 하여 추후 삭제 해도 됨
 * @date 2020.03.23
 * @author 김호겸
 */

const constraints = {
  audio: true
}
let audioStream = null
let audioSource = null
let audioDestination = null
let audioVolume = 0
let audioEl = document.createElement('audio')
audioEl.autoplay = true
audioEl.muted = false

export const setAudioVolume = value => {
  if (Number(value) > 1 || Number(value) < 0) return
  console.log('볼륨 크기 = ' + value)
  if (audioEl) audioEl.volume = value
}
export const getAudioVolume = () => {
  console.log('getAudioVolume = ' + audioEl.volume)
  return audioEl.volume
}
export const setMute = flag => {
  if (flag == null || flag == undefined) return
  if (audioEl) audioEl.muted = flag
}
export const processStream = () => {
  if (!audioStream) {
    return
  }
  const AudioContext = window.AudioContext || window.webkitAudioContext
  let audioContext = new AudioContext()

  let gainNode = audioContext.createGain()
  audioSource = audioContext.createMediaStreamSource(audioStream)
  audioDestination = audioContext.createMediaStreamDestination()
  audioSource.connect(gainNode)
  gainNode.connect(audioDestination)
  audioVolume = gainNode.gain.value
  console.log('볼륨 크기 = ' + audioVolume)
}
export const getStream = () => {
  return audioStream
}
export const Start = () => {
  console.clear()
  console.warn('start ')
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      console.log('got stream', stream)
      audioStream = stream
      audioEl.srcObject = stream
    })
    .then(() => {
      processStream()
      console.warn('stream 생성')
    })
    .catch(err => {
      console.error('Unable to capture stream', err)
    })
}

export const Stop = () => {
  console.clear()
  console.warn('stream 해제')
  if (audioStream) {
    audioStream.getTracks().forEach(track => {
      track.stop()
    })
    audioStream = null
    console.warn('stream 해제 완료')
  }
}

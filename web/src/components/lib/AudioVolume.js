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

export const volumeUp = () => {
  console.clear()

  if (audioVolume => 0.0 || audioVolume <= 1.0) audioVolume = (parseFloat(audioVolume) + 0.1).toFixed(1)

  console.warn('볼륨 업 = ' + audioVolume)
}
export const volumeDown = () => {
  console.clear()

  if (audioVolume => 0.0 || audioVolume <= 1.0) audioVolume = (parseFloat(audioVolume) - 0.1).toFixed(1)

  console.warn('볼륨 업 = ' + audioVolume)
}

// function changeMicrophoneLevel(e) {
//   var value = e.target.value;
//   if (value && value >= 0 && value <= 2) {
//     gainNode.gain.value = value;
//   }
// }
// export const volumeMousehandle = e => {
//   //console.log("Event Type = " + e.type);
//   if (e.type === "mouseup") {
//     // if (volumeDrag) {
//     //   volumeDrag = false;
//     //   updateVolume(e.pageX);
//     // }
//   } else if (e.type === "mousemove") {
//     if (volumeDrag) {
//       updateVolume(e.pageX);
//     }
//   } else if (e.type === "mousedown") {
//     volumeDrag = true;
//     audioEl.muted = false;
//     //$(".sound").removeClass("muted");
//     updateVolume(e.pageX);
//   }
//};

// const updateVolume = (x, vol) => {
//   console.log("x좌표 = " + x);
//   var volume = document.getElementsByClassName("volume")[0];
//   var percentage;
//   //if only volume have specificed
//   //then direct update volume
//   if (vol) {
//     percentage = vol * 100;
//   } else {
//     var position = x - volume.offsetLeft;
//     console.log("volume.offsetLeft = " + volume.offsetLeft);
//     console.log("volume.clientWidth = " + volume.clientWidth);
//     percentage = (100 * position) / volume.clientWidth;
//   }

//   if (percentage > 100) {
//     percentage = 100;
//   }
//   if (percentage < 0) {
//     percentage = 0;
//   }

//update volume bar and video volume
//volume.css("width", percentage + "%");
//   volume.style.width = percentage + "%";
//   audioEl.volume = percentage / 100;
//   console.log("볼륨 비율 = " + audioEl.volume);
//   //change sound icon based on volume
//   if (audio.volume == 0) {
//     $(".sound")
//       .removeClass("sound2")
//       .addClass("muted");
//   } else if (audio.volume > 0.5) {
//     $(".sound")
//       .removeClass("muted")
//       .addClass("sound2");
//   } else {
//     $(".sound")
//       .removeClass("muted")
//       .removeClass("sound2");
//   }
//};
// window.SetVolume = function(val) {
//   //var player = document.getElementById("video");
//   console.log("Before: " + audioEl.volume);
//   audioEl.volume = val / 100;
//   console.log("After: " + audioEl.volume);
// };

export function getDecibel(stream) {
  const AudioContext = (window.AudioContext || window.webkitAudioContext)()
  const audioCtx = new AudioContext()

  const audioStream = audioCtx.createMediaStreamSource(stream)
  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = 1024
  audioStream.connect(analyser)
  const bufferLength = analyser.frequencyBinCount
  const frequencyArray = new Uint8Array(bufferLength)

  analyser.getByteFrequencyData(frequencyArray)
  let total = 0
  frequencyArray.forEach(f => {
    total += f * f
  })
  const rms = Math.sqrt(total / bufferLength)
  let db = 20 * (Math.log(rms) / Math.log(10))
  db = Math.max(db, 0)
  db = Math.floor(db)

  return db
}

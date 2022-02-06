export default function getDecibel(analyser: any) {
  const bufferLength = analyser.frequencyBinCount;
  const frequencyArray = new Uint8Array(bufferLength);

  analyser.getByteFrequencyData(frequencyArray);
  let total = 0;
  frequencyArray.forEach((f) => {
    total += f * f;
  });
  const rms = Math.sqrt(total / bufferLength);
  let db = 25 * (Math.log(rms) / Math.log(10));
  db = Math.max(db, 0);
  db = Math.floor(db);

  return db;
}

export const extValidator = (ext) => {
  const list = ['jpg', 'jpeg', 'png']
  return list.includes(ext)
}

export const getFileExtension = (filename) => {
  const fileName = filename
  const fileSplited = fileName.split('.')
  return fileSplited.pop()?.toLowerCase()
}

export const getOrientation = (buffer) => {
  let view = new DataView(buffer)
  if (view.getUint16(0, false) !== 0xffd8) {
    return {
      buffer: view.buffer,
      orientation: -2
    }
  }
  let length = view.byteLength
  let offset = 2
  while (offset < length) {
    let marker = view.getUint16(offset, false)
    offset += 2
    if (marker === 0xffe1) {
      if (view.getUint32((offset += 2), false) !== 0x45786966) {
        return {
          buffer: view.buffer,
          orientation: -1
        }
      }
      let little = view.getUint16((offset += 6), false) === 0x4949
      offset += view.getUint32(offset + 4, little)
      let tags = view.getUint16(offset, little)
      offset += 2
      for (let i = 0; i < tags; i++) {
        if (view.getUint16(offset + i * 12, little) === 0x0112) {
          const orientation = view.getUint16(offset + i * 12 + 8, little)
          view.setUint16(offset + i * 12 + 8, 1, little)
          return {
            buffer: view.buffer,
            orientation
          }
        }
      }
    } else if ((marker & 0xff00) !== 0xff00) {
      break
    } else {
      offset += view.getUint16(offset, false)
    }
  }
  return {
    buffer: view.buffer,
    orientation: -1
  }
}

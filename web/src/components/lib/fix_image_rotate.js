import {useEffect} from 'react'

export default async function fixImageRotate(file) {
  //파일을 배열 버퍼로 읽는 최신 약속 기반 API
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)
  //오리엔테이션 뽑아내는 함수
  function getOrientation(buffer) {
    var view = new DataView(buffer)
    if (view.getUint16(0, false) !== 0xffd8) {
      return {
        buffer: view.buffer,
        orientation: -2
      }
    }
    var length = view.byteLength,
      offset = 2
    while (offset < length) {
      var marker = view.getUint16(offset, false)
      offset += 2
      if (marker === 0xffe1) {
        if (view.getUint32((offset += 2), false) !== 0x45786966) {
          return {
            buffer: view.buffer,
            orientation: -1
          }
        }
        var little = view.getUint16((offset += 6), false) === 0x4949
        offset += view.getUint32(offset + 4, little)
        var tags = view.getUint16(offset, little)
        offset += 2
        for (var i = 0; i < tags; i++) {
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
  //캔버스로 그려서 dataurl 로 뽑아내는 함수
  function drawAdjustImage(img, orientation) {
    const cnvs = document.createElement('canvas')
    const ctx = cnvs.getContext('2d')
    let dx = 0
    let dy = 0
    let dw
    let dh
    let deg = 0
    let vt = 1
    let hr = 1
    let rad
    let sin
    let cos
    cnvs.width = orientation >= 5 ? img.height : img.width
    cnvs.height = orientation >= 5 ? img.width : img.height
    switch (orientation) {
      case 2: // flip horizontal
        hr = -1
        dx = cnvs.width
        break
      case 3: // rotate 180 degrees
        deg = 180
        dx = cnvs.width
        dy = cnvs.height
        break
      case 4: // flip upside down
        vt = -1
        dy = cnvs.height
        break
      case 5: // flip upside down and rotate 90 degrees clock wise
        vt = -1
        deg = 90
        break
      case 6: // rotate 90 degrees clock wise
        deg = 90
        dx = cnvs.width
        break
      case 7: // flip upside down and rotate 270 degrees clock wise
        vt = -1
        deg = 270
        dx = cnvs.width
        dy = cnvs.height
        break
      case 8: // rotate 270 degrees clock wise
        deg = 270
        dy = cnvs.height
        break
    }
    rad = deg * (Math.PI / 180)
    sin = Math.sin(rad)
    cos = Math.cos(rad)
    ctx.setTransform(cos * hr, sin * hr, -sin * vt, cos * vt, dx, dy)
    dw = orientation >= 5 ? cnvs.height : cnvs.width
    dh = orientation >= 5 ? cnvs.width : cnvs.height
    ctx.drawImage(img, 0, 0, dw, dh)
    return cnvs.toDataURL('image/jpeg', 1.0)
  }

  reader.onload = async () => {
    const originalBuffer = reader.result
    const {buffer, orientation} = getOrientation(originalBuffer)
    const blob = new Blob([buffer])
    //createObjectURL 주어진 객체를 가리키는 URL을 DOMString으로 반환합니다
    const originalCacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(file)
    const cacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(blob)
    const img = new Image()
    img.src = cacheURL

    // console.log('originalCacheURL', originalCacheURL)

    img.onload = async () => {
      const limitSize = 1280
      if (img.width > limitSize || img.height > limitSize) {
        img.width = img.width / 5
        img.height = img.height / 5
      }

      const encodedDataAsBase64 = drawAdjustImage(img, orientation)
      //uploadImageToServer(encodedDataAsBase64)
      // console.log('encodedDataAsBase64', encodedDataAsBase64)
      const imgData = {
        blobUrl: originalCacheURL,
        encodedData: encodedDataAsBase64
      }
      console.log('1')
      return imgData
    }
  }
  //return null
}

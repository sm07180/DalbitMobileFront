import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import styled from 'styled-components'
import Header from './new_header'
import Cropper from 'react-cropper'
import './scss/dalbit_cropper.scss'
import ImageRotation from '../../images/ico-rotation.png'
import ImageCrop from '../../images/ico-crop.png'

const dalbitCropper = (props) => {
  const {editorOpen, setEditorOpen, srcUrl, setSrcUrl} = props

  const defaultSrc = srcUrl

  let history = useHistory()
  const context = useContext(Context)
  const [image, setImage] = useState(defaultSrc)
  const [cropData, setCropData] = useState('#')
  const [cropper, setCropper] = useState(null)
  const [isCrop, setIsCrop] = useState(false)

  const imageUrl = () => {
    if (!isCrop) {
      return image
    } else {
      return cropData
    }
  }
  const cropImage = () => {
    if (typeof cropper !== 'undefined') {
      setIsCrop(true)
      setCropData(cropper.getCroppedCanvas().toDataURL())
    }
  }
  const rotateImage = () => {
    if (typeof cropper !== 'undefined') {
      setIsCrop(false)
      setCropData(cropper.rotate(90))
    }
  }
  const submit = () => {
    if (typeof cropper !== 'undefined') {
      // setBase(cropper.getCroppedCanvas().toDataURL())
      context.action.updateEditImage(cropper.getCroppedCanvas().toDataURL())

      setEditorOpen(false)
    }
  }

  return (
    <Content>
      <div id="imageEditor">
        <Header type="cropperPopup" setEditorOpen={setEditorOpen} type="cropperPopup" />
        <Cropper
          style={{height: 'calc(100vh - 163px)', width: '100%', display: 'flex', alignItems: 'center'}}
          initialAspectRatio={1}
          preview=".img-preview"
          src={imageUrl()}
          viewMode={1}
          guides={true}
          minCropBoxHeight={5}
          minCropBoxWidth={5}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance)
          }}
        />

        <div className="btnBox">
          <button onClick={rotateImage}>
            <img src={ImageRotation} alt="회전" />
          </button>
          <button className="btn__ok" onClick={cropImage}>
            <img src={ImageCrop} alt="자르기" />
          </button>
          <button className="btn__save" onClick={submit}>
            저장
          </button>
        </div>
      </div>
    </Content>
  )
}

export default dalbitCropper

const Content = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  z-index: 10;
  #imageEditor {
    .header-wrap {
      background: transparent;
      border-bottom: 0;
    }
    .btnBox {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 0 0 14px;
      background-color: rgba(0, 0, 0, 0.8);
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      button {
        width: 50%;
        height: 54px;
        color: #fff;
        &:first-child {
          margin-left: 0;
        }
        img {
          width: 32px;
        }
      }
      .btn__save {
        width: 94%;
        height: 44px;
        margin: 0 3%;
        letter-spacing: -0.4px;
        line-height: 44px;
        font-size: 18px;
        font-weight: bold;
        background-color: #632beb;
        color: #fff;
        border-radius: 12px;
      }
    }

    .cropper-container {
      direction: ltr;
      font-size: 0;
      line-height: 0;
      position: relative;
      -ms-touch-action: none;
      touch-action: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .cropper-container img {
      display: block;
      height: 100%;
      image-orientation: 0deg;
      max-height: none !important;
      max-width: none !important;
      min-height: 0 !important;
      min-width: 0 !important;
      width: 100%;
    }

    .cropper-wrap-box,
    .cropper-canvas,
    .cropper-drag-box,
    .cropper-crop-box,
    .cropper-modal {
      bottom: 0;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    .cropper-wrap-box,
    .cropper-canvas {
      overflow: hidden;
    }

    .cropper-view-box {
      display: block;
      height: 100%;
      outline: 1px solid #39f;
      outline-color: rgba(51, 153, 255, 0.75);
      overflow: hidden;
      width: 100%;
    }

    .cropper-dashed {
      border: 0 dashed #eee;
      display: block;
      opacity: 0.5;
      position: absolute;
    }

    .cropper-dashed.dashed-h {
      border-bottom-width: 1px;
      border-top-width: 1px;
      height: calc(100% / 3);
      left: 0;
      top: calc(100% / 3);
      width: 100%;
    }

    .cropper-dashed.dashed-v {
      border-left-width: 1px;
      border-right-width: 1px;
      height: 100%;
      left: calc(100% / 3);
      top: 0;
      width: calc(100% / 3);
    }

    .cropper-center {
      display: block;
      height: 0;
      left: 50%;
      opacity: 0.75;
      position: absolute;
      top: 50%;
      width: 0;
    }

    .cropper-center::before,
    .cropper-center::after {
      background-color: #eee;
      content: ' ';
      display: block;
      position: absolute;
    }

    .cropper-center::before {
      height: 1px;
      left: -3px;
      top: 0;
      width: 7px;
    }

    .cropper-center::after {
      height: 7px;
      left: 0;
      top: -3px;
      width: 1px;
    }

    .cropper-face,
    .cropper-line,
    .cropper-point {
      display: block;
      height: 100%;
      opacity: 0.1;
      position: absolute;
      width: 100%;
    }

    .cropper-face {
      background-color: #fff;
      left: 0;
      top: 0;
    }

    .cropper-line {
      background-color: #39f;
    }

    .cropper-line.line-e {
      cursor: ew-resize;
      right: -3px;
      top: 0;
      width: 5px;
    }

    .cropper-line.line-n {
      cursor: ns-resize;
      height: 5px;
      left: 0;
      top: -3px;
    }

    .cropper-line.line-w {
      cursor: ew-resize;
      left: -3px;
      top: 0;
      width: 5px;
    }

    .cropper-line.line-s {
      bottom: -3px;
      cursor: ns-resize;
      height: 5px;
      left: 0;
    }

    .cropper-point {
      background-color: #39f;
      height: 5px;
      opacity: 0.75;
      width: 5px;
    }

    .cropper-point.point-e {
      cursor: ew-resize;
      margin-top: -3px;
      right: -3px;
      top: 50%;
    }

    .cropper-point.point-n {
      cursor: ns-resize;
      left: 50%;
      margin-left: -3px;
      top: -3px;
    }

    .cropper-point.point-w {
      cursor: ew-resize;
      left: -3px;
      margin-top: -3px;
      top: 50%;
    }

    .cropper-point.point-s {
      bottom: -3px;
      cursor: s-resize;
      left: 50%;
      margin-left: -3px;
    }

    .cropper-point.point-ne {
      cursor: nesw-resize;
      right: -3px;
      top: -3px;
    }

    .cropper-point.point-nw {
      cursor: nwse-resize;
      left: -3px;
      top: -3px;
    }

    .cropper-point.point-sw {
      bottom: -3px;
      cursor: nesw-resize;
      left: -3px;
    }

    .cropper-point.point-se {
      bottom: -3px;
      cursor: nwse-resize;
      height: 20px;
      opacity: 1;
      right: -3px;
      width: 20px;
    }

    @media (min-width: 768px) {
      .cropper-point.point-se {
        height: 15px;
        width: 15px;
      }
    }

    @media (min-width: 992px) {
      .cropper-point.point-se {
        height: 10px;
        width: 10px;
      }
    }

    @media (min-width: 1200px) {
      .cropper-point.point-se {
        height: 5px;
        opacity: 0.75;
        width: 5px;
      }
    }

    .cropper-point.point-se::before {
      background-color: #39f;
      bottom: -50%;
      content: ' ';
      display: block;
      height: 200%;
      opacity: 0;
      position: absolute;
      right: -50%;
      width: 200%;
    }

    .cropper-invisible {
      opacity: 0;
    }

    .cropper-bg {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
    }

    .cropper-hide {
      display: block;
      height: 0;
      position: absolute;
      width: 0;
    }

    .cropper-hidden {
      display: none !important;
    }

    .cropper-move {
      cursor: move;
    }

    .cropper-crop {
      cursor: crosshair;
    }

    .cropper-disabled .cropper-drag-box,
    .cropper-disabled .cropper-face,
    .cropper-disabled .cropper-line,
    .cropper-disabled .cropper-point {
      cursor: not-allowed;
    }
  }
`
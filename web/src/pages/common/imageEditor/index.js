import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import styled from 'styled-components'
import Header from 'components/ui/new_header'
import Cropper from 'react-cropper'
import '../../mypage/setting.scss'
import ImageRotation from './static/ico-rotation.png'
import ImageCrop from './static/ico-crop.png'

export default (props) => {
  const context = useContext(Context)
  const defaultSrc = context.tempImage
  let history = useHistory()

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
      if (context.editImage) {
        context.action.updateEditImage(cropper.getCroppedCanvas().toDataURL())
      }
      history.goBack()
    }
  }

  useEffect(() => {
    if (image === null) {
      history.goBack()
    }
  }, [])

  return (
    <Content>
      <div id="imageEditor">
        <Header type="blackBg">
          <div className="btnBox">
            <button onClick={rotateImage}>
              <img src={ImageRotation} alt="회전" />
            </button>
            <button className="btn__ok" onClick={cropImage}>
              <img src={ImageCrop} alt="자르기" />
            </button>
          </div>
        </Header>
        <Cropper
          style={{height: 'calc(100vh - 50px)', width: '100%', display: 'flex', alignItems: 'center'}}
          initialAspectRatio={1}
          preview=".img-preview"
          src={imageUrl()}
          viewMode={1}
          guides={true}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance)
          }}
        />
        {/* result view 
        <div className="box" style={{width: '50%', margin: '0 auto', height: '300px'}}>
          <img style={{width: '100%'}} src={cropData} alt="cropped" />
        </div>
        */}
        <button className="btn__save" onClick={submit}>
          저장
        </button>
      </div>
    </Content>
  )
}

const Content = styled.div`
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  #imageEditor {
    .header-wrap {
      background: transparent;
      border-bottom: 0;
      .btnBox {
        position: absolute;
        right: 16px;
        button {
          width: 24px;
          height: 24px;
          margin-left: 10px;
          color: #fff;
          &:first-child {
            margin-left: 0;
          }
          img {
            width: 100%;
          }
        }
      }
    }
    .btn__save {
      position: absolute;
      bottom: 14px;
      width: 94%;
      margin: 0 3%;
      margin-top: 32px;
      letter-spacing: -0.4px;
      line-height: 44px;
      font-size: 18px;
      font-weight: bold;
      background-color: #632beb;
      color: #fff;
      border-radius: 12px;
    }
  }
`

import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
import Header from 'components/ui/new_header'
import Cropper from 'react-cropper'
import '../../mypage/setting.scss'
import ImageRotation from './static/ico-rotation.png'
import ImageCrop from './static/ico-crop.png'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxEditImage} from "redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  let history = useHistory()
  const {location} = history
  const defaultSrc = location.state['src'] || ''
  const mimeType = location.state.mimeType || 'jpeg'
  const isQualityDown = location.state.isQualityDown || false
  const convertType = mimeType === 'jpg' ? 'jpeg' : mimeType
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
      if (isQualityDown) {
        setCropData(cropper.getCroppedCanvas().toDataURL(`image/${convertType}`, 20 / 100))
      } else {
        setCropData(cropper.getCroppedCanvas().toDataURL(`image/${convertType}`))
      }
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
      // console.log('size', cropper.getCroppedCanvas().toDataURL())
      // console.log('len', cropper.getCroppedCanvas().toDataURL().length)
      if (isQualityDown) {
        dispatch(setGlobalCtxEditImage(cropper.getCroppedCanvas().toDataURL(`image/${convertType}`, 20 / 100)));
      } else {
        dispatch(setGlobalCtxEditImage(cropper.getCroppedCanvas().toDataURL(`image/${convertType}`)));
      }

      history.goBack()
    }
  }

  useEffect(() => {
    if (image === null || image === '') {
      history.goBack()
    }
  }, [])

  return (
    <Content>
      <div id="imageEditor">
        <Header type="blackBg" />
        <Cropper
          style={{height: 'calc(100vh - 163px)', width: '100%', display: 'flex', alignItems: 'center'}}
          initialAspectRatio={1}
          preview=".img-preview"
          src={imageUrl()}
          viewMode={1}
          guides={true}
          minCropBoxWidth={100}
          minCropBoxHeight={100}
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

const Content = styled.div`
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
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
  }
`

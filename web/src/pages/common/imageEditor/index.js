import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import styled from 'styled-components'
import Header from 'components/ui/new_header'
import Cropper from 'react-cropper'
import '../../mypage/setting.scss'

export default (props) => {
  const context = useContext(Context)
  const defaultSrc = context.editImage
  let history = useHistory()

  const [image, setImage] = useState(defaultSrc)
  const [cropData, setCropData] = useState('#')
  const [cropper, setCropper] = useState(null)

  const cropImage = () => {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.getCroppedCanvas().toDataURL())
      if (context.editImage) {
        context.action.updateEditImage(cropper.getCroppedCanvas().toDataURL())
      }
    }
  }
  const rotateImage = () => {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.rotate(90))
    }
  }
  const submit = () => {
    if (typeof cropper !== 'undefined') {
      // setCropData(cropper.getCroppedCanvas().toDataURL())
      if (context.editImage) {
        context.action.updateEditImage(cropper.getCroppedCanvas().toDataURL())
      }
      history.goBack()
    }
  }

  useEffect(() => {
    console.log(image)
    if (image === null) {
      history.goBack()
    }
  }, [])

  return (
    <Content>
      <div id="imageEditor">
        <Header>
          <div className="btnBox">
            {/* <button onClick={cropImage}>Crop</button> */}
            <button onClick={rotateImage}>Rotate</button>
            <button className="btn__ok" onClick={submit}>
              자르기
            </button>
          </div>
        </Header>
        <Cropper
          // style={{height: 'calc(100vh - 50px)', width: '100%', display: 'flex', alignItems: 'center'}}
          initialAspectRatio={1}
          preview=".img-preview"
          src={image}
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
      </div>
    </Content>
  )
}

const Content = styled.div`
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  #imageEditor {
    .header-wrap {
      background: transparent;
      border-bottom: 0;
      .btnBox {
        position: absolute;
        right: 16px;
        button {
          margin-left: 10px;
          color: #fff;
          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
  }
`

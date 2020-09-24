import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'Context'
import styled from 'styled-components'
import Header from 'components/ui/new_header'
import Cropper from 'react-cropper'
import '../../mypage/setting.scss'

export default (props) => {
  const context = useContext(Context)
  console.log(context)
  const defaultSrc = 'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg'
  let history = useHistory()

  const [image, setImage] = useState(defaultSrc)
  const [cropData, setCropData] = useState('#')
  const [cropper, setCropper] = useState(null)

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.getCroppedCanvas().toDataURL())
      if (context.imageEditor) {
        context.action.updateImageEditor(cropper.getCroppedCanvas().toDataURL())
      }
    }
  }
  const getRotateData = () => {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.rotate(90))
    }
  }
  const goSubmit = () => {
    getCropData()
    history.goBack()
  }

  useEffect(() => {
    console.log(props)
  }, [])
  return (
    <Content>
      <div id="imageEditor">
        <Header>
          <div className="btnBox">
            <button onClick={getCropData}>Crop</button>
            <button onClick={getRotateData}>Rotate</button>
            <button className="btn__ok" onClick={goSubmit}>
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
        <div className="box" style={{width: '50%', margin: '0 auto', height: '300px'}}>
          <img style={{width: '100%'}} src={cropData} alt="cropped" />
        </div>
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

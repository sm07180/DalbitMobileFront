import React, {useEffect} from 'react'

import styled from 'styled-components'
import Header from 'components/ui/new_header'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

export default (props) => {
  useEffect(() => {
    console.log(props)
  }, [])
  return (
    <Content>
      <div id="imageEditor">
        <Header>
          <button className="btn__ok">자르기</button>
        </Header>
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
      .btn__ok {
        position: absolute;
        right: 16px;
        color: #fff;
      }
    }
  }
`

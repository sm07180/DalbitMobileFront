import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Navi from './navibar'
export default props => {
  const [profileInfo, setLiveInfo] = useState(props.Info)
  console.log(profileInfo.profImg)

  return (
    <Container>
      <Navi title={'프로필'} />
      <div className="imgWrap">
        <div className="profileImg" bg={profileInfo.profImg} />
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  align-items: center;
  flex-direction: column;
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 360px;
  }
  .imgWrap {
    position: relative;
    width: 126px;
    height: 126px;
    background: url('https://devimage.dalbitcast.com/images/api/ic_frame_l.png') no-repeat center center/ cover;
    & .profileImg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 96px;
      height: 96px;
      background: url(${props => props.bg}) no-repeat center center / cover;
      border-radius: 50%;
    }
  }
`

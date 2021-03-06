import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_TABLET_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import Navi from './navibar'
import Api from 'context/api'
import Ranking from './ranking'
import qs from 'query-string'

export default props => {
  //console.log(props)

  const [roomInfo, setRoomInfo] = useState({...props.location.state})
  //----------------------------------------------context
  const {roomNo} = qs.parse(location.search)
  //0.프로필인포 state정의------------------------------------------
  const [PInfo, setPInfo] = useState(props.Info)
  //------------------------------------------------
  const percent = PInfo.exp / 300
  //function validation
  const validate1000 = () => {
    if (PInfo.fanCnt > 999) {
      return PInfo.fanCnt / 1000 + 'K'
    } else {
      return PInfo.fanCnt
    }
  }
  //--------------------------------------
  //api
  async function fetchData() {
    const res = await Api.info_view({
      params: {
        memNo: '41581991354103',
        roomNo: '91582156781600'
      }
    })
    console.log(res)
  }
  useEffect(() => {
    fetchData()
  }, [])
  //----------------------------------------
  return (
    <Container>
      <Navi title={'프로필'} />
      <div className="imgWrap">
        <PIMG bg={roomInfo.bjProfImg.url} />
      </div>
      <div className="gazeWrap">
        <div className="gazeBar">
          <GazeBar gaze={percent}>
            <p>{PInfo.exp}</p>
          </GazeBar>
        </div>
      </div>
      <h5 className="levelWrap">
        {PInfo.grade} / Lv.{PInfo.level}
      </h5>
      <h5 className="nickWrap">{roomInfo.bjNickNm}</h5>
      <h5 className="IdWrap">{roomInfo.bjStreamId}</h5>
      <div className="fanWrap">
        <div>
          <div className="fanstarbox">
            <span>팬</span>
            <em>{validate1000()}</em>
          </div>
          <div className="fanstarbox">
            <span>스타</span>
            <em>{PInfo.starCnt}</em>
          </div>
        </div>
        <Ranking {...roomInfo} />
      </div>
    </Container>
  )
}
//----------------------------------------
//styled
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
    background: url(${IMG_SERVER}/images/api/ic_frame_l.png) no-repeat center center/ cover;
  }
  .gazeWrap {
    position: relative;
    width: 100%;
    margin-top: 5px;
    color: #bdbdbd;
    font-size: 14px;
    &:before {
      position: absolute;
      width: 25px;
      left: 0;
      top: 0;
      content: '0';
      line-height: 1.6;
      text-align: right;
      transform: skew(-0.03deg);
    }
    &:after {
      position: absolute;
      content: '300';
      right: 0;
      top: 0;
      line-height: 20px;
      transform: skew(-0.03deg);
    }
  }
  .gazeBar {
    position: relative;
    width: 312px;
    margin: 0 auto;
    height: 20px;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
  }
  .levelWrap {
    margin-top: 20px;
    color: #424242;
    font-size: 14px;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
  .nickWrap {
    color: #424242;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
    transform: skew(-0.03deg);
  }
  .IdWrap {
    margin-top: 4px;
    color: #9e9e9e;
    font-size: 16px;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
  }
  .fanWrap {
    display: flex;
    width: 100%;
    flex-direction: column;
    margin-top: 16px;
    padding: 28px 0;
    border-radius: 20px;
    background-color: #f4f4f4;
    text-align: center;
    & div {
      display: flex;
      align-items: center;
      justify-content: center;
      & .fanstarbox {
        width: 50%;
      }
      & span {
        color: #9e9e9e;
        margin-right: 16px;
        font-size: 14px;
        letter-spacing: -0.35px;
        transform: skew(-0.03deg);
      }
      & em {
        color: ${COLOR_MAIN};
        font-size: 20px;
        font-weight: 600;
        font-style: normal;
        letter-spacing: -0.5px;
        transform: skew(-0.03deg);
      }
    }
  }
`
const PIMG = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 96px;
  height: 96px;
  background: url(${props => props.bg}) no-repeat center center / cover;
  border-radius: 50%;
`

const GazeBar = styled.div`
  position: absolute;
  width: calc(${props => props.gaze} * 100%);
  background-color: ${COLOR_MAIN};
  border-radius: 10px;
  & p {
    padding-right: 5px;
    color: #fff;
    font-size: 14px;
    text-align: right;
    line-height: 20px;
    transform: skew(-0.03deg);
  }
`

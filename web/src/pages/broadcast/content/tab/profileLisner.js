import React, {useEffect, useState, useContext, useMemo} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Navi from './navibar'
import Api from 'context/api'
import {Context} from 'context'
import Ranking from './ranking'
import {BroadCastStore} from '../../store'

export default props => {
  //console.log(props)

  const [roomInfo, setRoomInfo] = useState({...props.location.state})

  //----------------------------------------------context
  const context = useContext(Context)
  const store = useContext(BroadCastStore)
  //0.프로필인포 state정의------------------------------------------
  const [PInfo, setPInfo] = useState(props.Info)
  //------------------------------------------------
  const percent = PInfo.exp / 300
  //function validation
  const validate1000 = Cnt => {
    if (Cnt > 999) {
      return Cnt / 1000 + 'K'
    } else {
      return Cnt
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

  //팬등록
  async function broad_fan_insert() {
    console.loo('팬등록 = ' + store.roomInfo)
    const res = await Api.broad_fan_insert({
      data: {
        memNo: objProfileInfo.bjMemNo,
        roomNo: objProfileInfo.roomNo
      }
    })
    //Error발생시
    if (res.result === 'fail' || res.result === 'success') {
      context.action.alert({
        // 부스트 사용완료 팝업
        callback: () => {
          console.log('callback처리')
        },
        title: '달빛라디오',
        msg: res.message
      })
    }
  }
  //매니저 지정 , 해제 Api
  async function broadManager(type, obj) {
    const methodType = type === 1 ? 'POST' : 'DELETE'

    const res = await Api.broad_manager({
      data: {
        roomNo: store.roomInfo.roomNo,
        memNo: obj.memNo,
        auth: store.roomInfo.auth
      },
      method: methodType
    })
    //Error발생시
    if (res.result === 'success') {
      store.action.updateRoomInfo({auth: 1})
      store.action.updateListenTrues(false)
      return (bjno = res.data.memNo)
    } else {
      console.log('broadManager  res = ' + res)
    }
  }

  // 강퇴 Api
  async function broadkickout(obj) {
    const res = await Api.broad_kickout({
      data: {
        roomNo: store.roomInfo.roomNo,
        blockNo: obj.memNo
      },
      method: 'POST'
    })
    //Error발생시
    if (res.result === 'success') {
      sc.SendMessageKickout(res)
    }
  }
  useEffect(() => {
    console.log(store.broadcastProfileInfo)
    //fetchData()
  }, [store.broadcastProfileInfo])

  const userTypeContents = () => {
    if (store.broadcastProfileInfo.auth < 2) {
      return (
        <React.Fragment>
          <div className="functionWrap">
            <div className="managerBtn">
              <button></button>
              <p>매니저 해제</p>
            </div>
            <div className="KickBtn">
              <button></button>
              <p>강퇴하기</p>
            </div>
          </div>
          <div className="submitWrap">
            <button>+ 팬등록</button>
            <button>선물하기</button>
          </div>
        </React.Fragment>
      )
    }
  }
  const makeContents = () => {
    let objProfileInfo = null
    objProfileInfo = store.broadcastProfileInfo
    if (store.broadcastProfileInfo === null) return

    //console.log(store.broadcastProfileInfo)
    return (
      <React.Fragment>
        <button className="reportBtn"></button>
        <div className="imgWrap">
          <PIMG bg={objProfileInfo.profImg.url} />
        </div>
        <div className="gazeWrap">
          <div className="gazeBar">
            <GazeBar gaze={percent}>
              <p>{objProfileInfo.exp}</p>
            </GazeBar>
          </div>
        </div>
        <h5 className="levelWrap">
          {objProfileInfo.grade} / Lv.{objProfileInfo.level}
        </h5>
        <h5 className="nickWrap">{objProfileInfo.nickNm}</h5>
        <h5 className="IdWrap">{roomInfo.bjStreamId}</h5>
        <div className="fanWrap">
          <div>
            <div className="fanstarbox">
              <span>팬</span>
              <em>{validate1000(objProfileInfo.fanCnt)}</em>
            </div>
            <div className="fanstarbox">
              <span>스타</span>
              <em>{objProfileInfo.starCnt}</em>
            </div>
          </div>
          <Ranking {...roomInfo} />
        </div>
        {userTypeContents()}
      </React.Fragment>
    )
  }
  //----------------------------------------
  return (
    <Container>
      <Navi title={'프로필'} />
      {makeContents()}
    </Container>
  )
}
//----------------------------------------
//styled
const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  align-items: center;
  flex-direction: column;
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 360px;
  }
  .reportBtn {
    position: absolute;
    top: 94px;
    left: 25px;
    width: 36px;
    height: 36px;
    background: url(${IMG_SERVER}/images/api/ic_report.png) no-repeat center center / cover;
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
        color: #8556f6;
        font-size: 20px;
        font-weight: 600;
        font-style: normal;
        letter-spacing: -0.5px;
        transform: skew(-0.03deg);
      }
    }
  }
  .functionWrap {
    display: flex;
    margin-top: 10px;
    width: 100%;
    & .managerBtn {
      padding: 8px 0 10px 0;
      width: 50%;
      & > button {
        display: block;
        width: 24px;
        height: 24px;
        margin: 0 auto;
        background: url(${IMG_SERVER}/images/api/manager.png) no-repeat center center / cover;
      }
      & > p {
        margin-top: 6px;
        color: #9e9e9e;
        font-size: 14px;
        line-height: 1.14;
        letter-spacing: -0.35px;
        text-align: center;
        transform: skew(-0.03deg);
      }
    }
    & .KickBtn {
      padding: 8px 0 10px 0;
      width: 50%;
      & > button {
        display: block;
        width: 24px;
        height: 24px;
        margin: 0 auto;
        background: url(${IMG_SERVER}/images/api/ic_forced%20exit.png) no-repeat center center / cover;
      }
      & > p {
        margin-top: 6px;
        color: #9e9e9e;
        font-size: 14px;
        line-height: 1.14;
        letter-spacing: -0.35px;
        text-align: center;
        transform: skew(-0.03deg);
      }
    }
  }
  & .submitWrap {
    display: flex;
    margin-top: 10px;
    width: 100%;
    & button {
      display: block;
      width: 50%;
      padding: 15px 0 15px 0;
      border-radius: 10px;
      background-color: #8556f6;
      color: #fff;
      font-size: 16px;
      transform: skew(-0.03deg);
    }
    & button:first-child {
      margin-right: 8px;
      border: 1px solid #bdbdbd;
      background-color: #fff;
      color: #9e9e9e;
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
  background-color: #8556f6;
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

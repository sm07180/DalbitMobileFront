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
  let objProfileInfo = null
  objProfileInfo = store.broadcastProfileInfo

  //--------------------------------------
  //api
  async function broadFanChangeFetch(methodType) {
    const res = await Api.broad_fan_insert({
      data: {
        memNo: objProfileInfo.memNo,
        roomNo: context.broadcastTotalInfo.roomNo
      },
      method: methodType
    })
    if (res.result === 'success') {
      if (methodType === 'POST') {
        store.action.updateBroadcastProfileInfo({isFan: true})
      } else {
        store.action.updateBroadcastProfileInfo({isFan: false})
      }

      context.action.alert({
        callback: () => {
          //console.log('callback처리')
        },
        msg: res.message
      })
    }
  }

  //팬등록
  function broad_fan_change(isFan) {
    console.log('팬등록 = ' + store.roomInfo)
    const methodType = isFan === false ? 'POST' : 'DELETE'
    // 팬이 아니여서 팬등록 가능 상태
    if (isFan === true) {
      context.action.confirm({
        //콜백처리
        callback: () => {
          broadFanChangeFetch(methodType)
        },
        //캔슬콜백처리
        cancelCallback: () => {},
        msg: `${objProfileInfo.nickNm} 님의 팬을 취소하시겠습니까?`
      })
    } else {
      broadFanChangeFetch(methodType)
    }
  }

  //매니저 지정 , 해제 Api
  async function broadManager(type) {
    const methodType = type === 1 ? 'DELETE' : 'POST'
    const res = await Api.broad_manager({
      data: {
        roomNo: context.broadcastTotalInfo.roomNo,
        memNo: objProfileInfo.memNo
      },
      method: methodType
    })
    //Error발생시
    if (res.result === 'success') {
      if (type === 1) {
        store.action.updateBroadcastProfileInfo({auth: 0})
      } else {
        store.action.updateBroadcastProfileInfo({auth: 1})
      }
      context.action.alert({
        //콜백처리
        msg: `${objProfileInfo.nickNm} 님이 매니저 ${type === 1 ? '해제' : '등록'} 되었습니다.`
      })
    } else {
      console.log('broadManager  res = ' + res)
    }
  }

  // 강퇴 Api
  async function broadkickout() {
    const res = await Api.broad_kickout({
      data: {
        roomNo: context.broadcastTotalInfo.roomNo,
        blockNo: objProfileInfo.memNo
      },
      method: 'POST'
    })
    //Error발생시
    if (res.result === 'success') {
      context.action.alert({
        //콜백처리
        msg: `${objProfileInfo.nickNm} 님이 강제 퇴장 되었습니다.`
      })
    }
  }

  const goDeclaration = () => {
    store.action.updateTab(7)
    store.action.updateReportData({nickNm: objProfileInfo.nickNm, memNo: objProfileInfo.memNo})
  }
  const DeclarationBtn = () => {
    if (objProfileInfo.auth < 2) return <button className="reportBtn" onClick={() => goDeclaration()}></button>
    else return <></>
  }

  useEffect(() => {
    console.log(store.broadcastProfileInfo)
    //fetchData()
  }, [store.broadcastProfileInfo])

  const managerStatusChange = () => {
    if (context.broadcastTotalInfo.auth == objProfileInfo.auth) return //방장이면서 프로필도 방장이면 안보여줌)
    if (context.broadcastTotalInfo.auth === 1 && objProfileInfo.auth <= 1) return //같은 매니저 이거나 선택자가 청취자 일때
    if (context.broadcastTotalInfo.auth === 0 && objProfileInfo.auth > 0) return //같은 매니저 이거나 선택자가 청취자 일때
    return (
      <React.Fragment>
        <div className="managerBtn">
          <button
            onClick={() => {
              context.action.confirm({
                //콜백처리
                callback: () => {
                  broadManager(store.broadcastProfileInfo.auth)
                },
                //캔슬콜백처리
                cancelCallback: () => {
                  //alert('confirm callback 취소하기')
                },
                msg: `${objProfileInfo.nickNm} 님을 매니저에서 ${
                  store.broadcastProfileInfo.auth == 1 ? '해임' : '등록'
                } 하시겠습니까?`
              })
            }}></button>
          <p>{store.broadcastProfileInfo.auth == 1 ? '매니저 해임' : '매니저 등록'}</p>
        </div>
      </React.Fragment>
    )
  }
  const makeKickout = () => {
    if (context.broadcastTotalInfo.auth == objProfileInfo.auth) return //방장이면서 프로필도 방장이면 안보여줌)
    if (context.broadcastTotalInfo.auth === 0 && objProfileInfo.auth > 0) return //같은 매니저 이거나 선택자가 청취자 일때
    return (
      <React.Fragment>
        <div className="functionWrap">
          {managerStatusChange()}
          <div className="KickBtn">
            <button
              onClick={() => {
                context.action.confirm({
                  //콜백처리
                  callback: () => {
                    broadkickout()
                  },
                  //캔슬콜백처리
                  cancelCallback: () => {
                    //alert('confirm callback 취소하기')
                  },
                  msg: `${objProfileInfo.nickNm} 님을 강제 퇴장 하시겠습니까?`
                })
              }}></button>
            <p>강퇴하기</p>
          </div>
        </div>
      </React.Fragment>
    )
  }
  //선물 하기
  const goGiftSend = () => {
    store.action.updateGiftSendType(1)
    store.action.updateTab(4) //선물하기 탭 이동
  }
  const userTypeContents = () => {
    if (context.token.memNo === objProfileInfo.memNo) return
    return (
      <React.Fragment>
        {makeKickout()}
        <div className="submitWrap">
          <button
            className={objProfileInfo.isFan === true ? 'on' : ''}
            onClick={() => {
              broad_fan_change(objProfileInfo.isFan)
            }}>
            {objProfileInfo.isFan === false ? '+팬등록' : '팬'}
          </button>
          <button onClick={() => goGiftSend()}>선물하기</button>
        </div>
      </React.Fragment>
    )
  }
  const makeContents = () => {
    if (store.broadcastProfileInfo === null) return

    //console.log(store.broadcastProfileInfo)
    return (
      <React.Fragment>
        {DeclarationBtn()}
        <div className="imgWrap">
          <PIMG bg={objProfileInfo.profImg.url} />
        </div>
        <div className="gazeWrap">
          <span>{objProfileInfo.expBegin}</span>
          <div className="gazeBar">
            <GazeBar gaze={objProfileInfo.expRate} expNext={objProfileInfo}>
              <p>{`${objProfileInfo.expRate}%`}</p>
            </GazeBar>
          </div>
          <span>{objProfileInfo.expNext}</span>
        </div>
        <h5 className="levelWrap">
          {objProfileInfo.grade} / Lv.{objProfileInfo.level}
        </h5>
        <h5 className="nickWrap">{objProfileInfo.nickNm}</h5>
        <h5 className="IdWrap">{`@${objProfileInfo.memId}`}</h5>
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
          <Ranking {...objProfileInfo} />
        </div>
        {userTypeContents()}
      </React.Fragment>
    )
  }
  //----------------------------------------
  return (
    <Container>
      <Navi title={'프로필'} prev={props.prev} _changeItem={props._changeItem} />
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
    display: flex;
    width: 100%;
    margin-top: 5px;
    color: #bdbdbd;
    font-size: 14px;

    & span {
      line-height:20px;
    }
    /* &:before {
      position: absolute;
      width: 25px;
      left: 0;
      top: 0;
      content: '0';
      line-height: 1.6;
      text-align: right;
      transform: skew(-0.03deg);
    } */
    /* &:after {
      position: absolute;
      content: ${props => props.expNext};
      right: 0;
      top: 0;
      line-height: 20px;
      transform: skew(-0.03deg);
    } */
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
    justify-content:center;
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
      border: 1px solid #bdbdbd;
      /* background-color: #8556f6; */
      background-color: #fff;
      /* color: #fff; */
      color: #9e9e9e;
      font-size: 16px;
      transform: skew(-0.03deg);
      margin-right: 8px;
    }
    & button:last-child {
      margin-right: 8px;
      border: 1px solid #8556f6;
      color: #fff;
      background-color: #8556f6;
    }
    & .on {
      border: 1px solid #8556f6;
      color: #8556f6;
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
  width: calc(${props => props.gaze}%);
  min-width: 15%;
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

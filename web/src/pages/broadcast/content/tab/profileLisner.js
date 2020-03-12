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

  //팬등록
  async function broad_fan_insert(isFan) {
    console.log('팬등록 = ' + store.roomInfo)
    const methodType = isFan === false ? 'POST' : 'DELETE'
    let res
    // 팬이 아니여서 팬등록 가능 상태
    if (isFan) {
      res = await Api.broad_fan_insert({
        data: {
          memNo: objProfileInfo.memNo,
          roomNo: context.broadcastTotalInfo.roomNo
        },
        method: methodType
      })
    } else {
      res = await Api.broad_fan_delete({
        data: {
          memNo: objProfileInfo.memNo
        },
        method: methodType
      })
    }

    if (res.result === 'fail' || res.result === 'success') {
      context.action.alert({
        callback: () => {
          //console.log('callback처리')
        },
        title: '달빛라디오',
        msg: res.message
      })
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
      //sc.SendMessageKickout(res)
    }
  }

  const isFanCheck = () => {
    if (context.broadcastTotalInfo.memNo === objProfileInfo.memNo) console.log('asdasdasd')
  }
  useEffect(() => {
    console.log(store.broadcastProfileInfo)
    //fetchData()
  }, [store.broadcastProfileInfo])

  const userTypeContents = () => {
    if (context.broadcastTotalInfo.auth > 1) {
      return (
        <React.Fragment>
          <div className="functionWrap">
            <div className="managerBtn">
              {/* <button onClick={() => broadManager(store.broadcastProfileInfo.auth)}></button> */}
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
                    msg: `${objProfileInfo.nickNm} 님을 매니저에서 ${store.broadcastProfileInfo.auth == 1 ? '해임' : '등록'} 하시겠습니까?`
                  })
                }}></button>
              <p>{store.broadcastProfileInfo.auth == 1 ? '매니저 해임' : '매니저 등록'}</p>
            </div>
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
          <div className="submitWrap">
            <button
              onClick={() => {
                broad_fan_insert(objProfileInfo.isFan)
              }}>
              {objProfileInfo.isFan === false ? '+팬등록' : '팬해제'}
            </button>
            <button
              onClick={() => {
                broad_fan_insert()
              }}>
              선물하기
            </button>
          </div>
        </React.Fragment>
      )
    }
  }
  const makeContents = () => {
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
          <Ranking {...objProfileInfo} />
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

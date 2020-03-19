/**
 * @title 청취자탭(최상위 컴포넌트)[비제이리스트,매니저리스트,청취자리스트]
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import styled from 'styled-components'
import {Context} from 'context'
import API from 'context/api'
//components--------------------------------------------------
import Events from './listener-event'
import EventBTNS from './listen-eventBTN'
import {Scrollbars} from 'react-custom-scrollbars'
import {BroadCastStore} from '../../store'
export default props => {
  const [roomInfo, setRoomInfo] = useState({...props.location.state})
  //context---------------------------------------------------------
  const context = useContext(Context)
  const store = useContext(BroadCastStore) //store
  const prevCountRef = useRef()

  //---------------------------------------------------------------
  //api(리스너 리스트)
  const fetchListenList = async () => {
    const {roomNo} = props.location.state
    const res = await API.broad_listeners({
      params: {roomNo}
    })
    if (res.result === 'success') {
      const {list} = res.data

      store.action.updateListenerList(list)
    }
    return
  }
  useEffect(() => {
    fetchListenList()
  }, [])

  // const userCheck = () => {
  //   console.log('sdasdadasds')

  //   switch (auth) {
  //     case 0:
  //       //drawListenList(store.listenerUpdate)
  //       break
  //     case 1:
  //       //drawManegerList(store.listenerUpdate)
  //       break
  //     default:
  //       break
  //   }
  // }
  // useEffect(() => {
  //   //userCheck()
  //   //if(store.listenerList.length === 0 ) return
  //   //store.listenerList.splice(0, 1, store.listenerUpdate)

  //   console.log('청취자 업데이트를 해라 ')
  //   //store.listenerList.push(store.listenerUpdate)
  //   userCheck()
  // }, [store.listenerUpdate])

  useEffect(() => {
    //if (store.listenerList.length == 0) return
    //drawListenList()
    console.log('청취자 update')
    //drawListenList()
  }, [store.listenerList])
  //---------------------------------------------------------------
  // 마우스 스크롤
  const settingArea = useRef(null) //세팅 스크롤 영역 선택자
  const scrollbars = useRef(null) // 스크롤 영역 선택자
  const [checkMove, setCheckMove] = useState(false)
  const handleOnWheel = () => {
    setCheckMove(true)
  }
  const scrollOnUpdate = e => {
    //스크롤영역 height 고정해주기, 윈도우 리사이즈시에도 동작
    settingArea.current.children[0].children[0].style.maxHeight = `calc(${settingArea.current.offsetHeight}px + 17px)`
  }
  //메니저 info맵-----------------------
  const drawManegerList = () => {
    if (store.listenerList === null || store.listenerList.length == 0) return
    return store.listenerList.map((live, index) => {
      let mode = '해당사항없음'
      const {nickNm, memNo, memId, profImg, auth} = live
      const {thumb62x62} = profImg
      //매니저  청취자 비제이 구분 auth로

      if (auth === 0) mode = '0'
      if (auth === 1) mode = '1'
      if (auth === 2) mode = '2'
      if (auth === 2) mode = '3'
      if (auth !== 1) return
      //----------------------------------------------------------------

      return (
        <ListenList key={index}>
          <p className="authClass">[{mode}]</p>
          <ManagerImg bg={thumb62x62} />
          <StreamID>{`@${memId}`}</StreamID>
          <NickName>{nickNm}</NickName>
          {context.token.memNo !== memNo && (
            <div className="btnwrap">
              <EventBTNS selectidx={index} />
            </div>
          )}
        </ListenList>
      )
    })
  }
  //----------------------------------------------------------------
  //리스너 인포맵
  const drawListenList = () => {
    //store.listenerList.splice(0, 1, obj)
    //if (obj) store.action.updateListenerList(obj)
    // if (obj && store.listenerList.length == 0) {
    //   store.action.updateListenerList(obj)
    //   console.log('청취자 추가 ')
    // }
    //if (store.listenerList === null) return

    return store.listenerList.map((live, index) => {
      let mode = '해당사항없음'
      const {nickNm, memNo, memId, profImg, auth} = live
      const {thumb62x62} = profImg
      //----------------------------------------------------------------
      if (auth === 0) mode = '0'
      if (auth === 1) mode = '1'
      if (auth === 2) mode = '2'
      if (auth === 3) mode = '3'
      if (auth !== 0) return

      // if (obj) {
      //   if (obj.memNo === memNo) {
      //     if (obj.state > 0) {
      //       //퇴장이나 강퇴 상태 -> 리스트에서 삭제
      //       console.log('삭제 시켜라 ')
      //       store.listenerList.splice(index, 1)
      //     } else {
      //       //입장 -> 리스트에 추가
      //       //store.listenerList.
      //     }
      //   }
      // }
      return (
        <ListenList key={index}>
          <p className="authClass">[{mode}]</p>
          <ManagerImg bg={thumb62x62} />
          <StreamID>{`@${memId}`}</StreamID>
          <NickName>{nickNm}</NickName>
          {context.token.memNo !== memNo && <div className="btnwrap">{roomInfo.memNo != memNo && <EventBTNS selectidx={index} />}</div>}
        </ListenList>
      )
    })
  }
  //-------------------------------------------------------------------------

  //render--------------------------------------------------------------------
  return (
    <>
      <Wrapper onWheel={handleOnWheel} ref={settingArea}>
        <Scrollbars ref={scrollbars} autoHeight autoHeightMax={'100%'} onUpdate={scrollOnUpdate} autoHide className="scrollCustom">
          <LiveWrap>
            <Title>방송 DJ</Title>
            <DJList>
              <ManagerImg bg={roomInfo.bjProfImg.url} />
              {/* <h2>{`@${roomInfo.memNo}`}</h2> */}
              <h2>{`@${roomInfo.bjMemId}`}</h2>
              <h5>{roomInfo.bjNickNm}</h5>
            </DJList>
          </LiveWrap>
          <LiveWrap>
            <Title>방송 매니저</Title>
            {drawManegerList()}
          </LiveWrap>
          <LiveWrap>
            <Title>청취자</Title>
            <ListenWrap>{drawListenList()}</ListenWrap>
          </LiveWrap>
        </Scrollbars>
      </Wrapper>
    </>
  )
}
//----------------------------------------------------------------
//style
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* 차후 탭 제거시 고정높이값 변경되어야함 */
  height: calc(100% - 60px);
  margin-top: 20px;
  & > div:last-child {
    height: 100%;
  }
  & .scrollCustom {
    & > div:nth-child(3) {
      width: 10px !important;
    }
  }
`
const LiveWrap = styled.div`
  margin-bottom: 20px;
  &:nth-child(3) {
    min-height: 242px;
  }
`
const DJList = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  padding: 4px;
  margin-top: 4px;
  background-color: ${COLOR_MAIN};
  border-radius: 24px;
  & h2 {
    max-width: 70px;
    height: 36px;
    margin-left: 10px;
    color: #fff;
    line-height: 36px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & h5 {
    height: 36px;
    margin-left: 36px;
    color: #fff;
    line-height: 36px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
  &:after {
    display: block;
    position: absolute;
    top: 50%;
    right: 12px;
    width: 24px;
    height: 14px;
    border-radius: 7px;
    background-color: #fdad2b;
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    text-align: center;
    line-height: 14px;
    transform: translateY(-50%);
    content: 'DJ';
  }
`
// const ManagerList = styled.div`
//   position: relative;
//   width: 100%;
//   display: flex;
//   padding: 4px;
//   margin-top: 4px;
//   border: 1px solid ${COLOR_MAIN};
//   border-radius: 24px;
// `
const ManagerImg = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: url(${props => props.bg}) no-repeat center center / cover;
`

const Title = styled.h4`
  display: inline-block;
  margin-bottom: 6px;
  color: #616161;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.14;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`
const StreamID = styled.h4`
  max-width: 100px;
  height: 36px;
  margin-left: 10px;
  color: ${COLOR_MAIN};
  line-height: 36px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
  overflow: hidden;
  text-overflow: ellipsis;
`
const NickName = styled.h4`
  height: 36px;
  margin-left: 36px;
  color: #424242;
  line-height: 36px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`
const ListenWrap = styled.div`
  z-index: 4;

  & > div:nth-last-child(-n + 4) {
    div {
      bottom: 0;
    }
  }
  & > div:first-child {
    div {
      /* max-height: 100% !important; */
      bottom: auto !important;
    }
  }
  & .authClass {
    font-size: 0;
  }
`
const ListenList = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  padding: 4px;
  margin-top: 4px;
  border: 1px solid #f5f5f5;
  border-radius: 24px;
  background-color: #fff;
  & .btnwrap {
    position: absolute;
    right: 0;
    width: 36px;
    height: 36px;
  }
  & .authClass {
    font-size: 0;
  }
`

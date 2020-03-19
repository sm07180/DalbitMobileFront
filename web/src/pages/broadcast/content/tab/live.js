/**
 * @title 라이브탭 컨텐츠
 */
import React, {useEffect, useState, useContext, useRef} from 'react'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import styled from 'styled-components'
//components-------------------------------------------------------------
import SelectInfo from './live-select-popular'
import CategoryInfo from './live-select-category'
import Refresh from './live-refresh'
import Api from 'context/api'
import {broadcastLive} from 'constant/broadcast'
import {BroadCastStore} from 'pages/broadcast/store'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import {Scrollbars} from 'react-custom-scrollbars'
import {isHybrid, Hybrid} from 'context/hybrid'

//------------------------------------------------------------------
export default props => {
  //context
  const store = useContext(BroadCastStore)
  const context = useContext(Context)
  const history = useHistory()
  //ref
  const settingArea = useRef(null) //세팅 스크롤 영역 선택자
  const scrollbars = useRef(null) // 스크롤 영역 선택자
  //0.배열Info State--------------------------------------------------
  const [broadList, setBroadList] = useState(null)
  const [fetch, setFetch] = useState(null)
  //------------------------------------------------------------------
  //fetch
  async function getBroadList(obj) {
    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      return
    }
    setFetch(res.data)
    store.action.updateLiveSortList(res.data)
  }

  //라이브 마우스 스크롤
  const [checkMove, setCheckMove] = useState(false)
  const handleOnWheel = () => {
    setCheckMove(true)
  }
  const scrollOnUpdate = e => {
    //스크롤영역 height 고정해주기, 윈도우 리사이즈시에도 동작
    settingArea.current.children[0].children[0].style.maxHeight = `calc(${settingArea.current.offsetHeight}px + 17px)`
  }
  //
  //exitRoom
  async function exitRoom(roomNo) {
    const res = await Api.broad_exit({data: {roomNo: roomNo}})
    if (res.result === 'success') {
      return res
    }
    alert(res.message)
  }
  //joinRoom
  async function joinRoom(roomNo) {
    const res = await Api.broad_join({data: {roomNo: roomNo}})

    console.log(res)
    //Error발생시 (방이 입장되어 있을때)
    if (res.result === 'fail' && res.messageKey === 'broadcast.room.join.already') {
      const exit = await exitRoom(roomNo)
      if (exit.result === 'success') joinRoom(roomNo)
    }
    //Error발생시 (종료된 방송)
    if (res.result === 'fail' && res.messageKey === 'broadcast.room.end') alert(res.message)
    //정상진입이거나,방탈퇴이후성공일경우
    if (res.result === 'success') {
      if (isHybrid()) {
        Hybrid('RoomJoin', res.data)
      } else {
        //하이브리드앱이 아닐때
        const {roomNo} = res.data
        context.action.updateBroadcastTotalInfo(res.data)
        history.push(`/broadcast?roomNo=${roomNo}`, res.data)
      }
    }
    return
  }

  console.log(store.liveSortList)
  //라이브 맵------------------------------------------------------------------------------------------------------
  const makeContents = () => {
    let sortlist = store.liveSortList
    if (sortlist === null) return
    return sortlist.list.map((live, index) => {
      const {state, roomType, title, bjNickNm, reco, nowpeople, entryCnt, newby, likeCnt, bgImg, bjProfImg, roomNo, gstProfImg} = live
      let mode = '해당사항없음'
      //console.log(roomNo)

      //
      if (state === 1) mode = '1'
      if (state === 2) mode = '2'
      if (state === 3) mode = '3'
      if (state === 4) mode = '4'
      if (state === 5) mode = '종료'
      //
      if (state !== 1) return

      if (store.category == roomType && context.roomInfo.roomNo !== roomNo) {
        return (
          <LiveList
            key={index}
            onClick={() => {
              joinRoom(roomNo)
            }}>
            <h3>[{mode}]</h3>
            <ImgWrap bg={bjProfImg.url}>
              <Sticker>
                {reco && <Reco>{reco}</Reco>}
                {newby && <New>{newby}</New>}
              </Sticker>
              {gstProfImg && <Thumb thumb={gstProfImg.thumb62x62} />}
            </ImgWrap>
            <InfoWrap>
              <Category>{broadcastLive[roomType]}</Category>
              <Title>{title}</Title>
              <Name>{bjNickNm}</Name>
              <IconWrap>
                <div>
                  <NowpeopleIcon></NowpeopleIcon>
                  <span>{entryCnt}</span>
                </div>
                <div>
                  <LikeIcon></LikeIcon>
                  <span>{likeCnt}</span>
                </div>
                <div>
                  <TotalpeopleIcon></TotalpeopleIcon>
                  <span>{entryCnt}</span>
                </div>
              </IconWrap>
            </InfoWrap>
          </LiveList>
        )
      }
      if (store.category == '' && context.roomInfo.roomNo !== roomNo) {
        return (
          <LiveList
            key={index}
            onClick={() => {
              joinRoom(roomNo)
            }}>
            <h3>[{mode}]</h3>
            <ImgWrap bg={bjProfImg.url}>
              <Sticker>
                {reco && <Reco>{reco}</Reco>}
                {newby && <New>{newby}</New>}
              </Sticker>
              {gstProfImg && <Thumb thumb={gstProfImg.thumb62x62} />}
            </ImgWrap>
            <InfoWrap>
              <Category>{broadcastLive[roomType]}</Category>
              <Title>{title}</Title>
              <Name>{bjNickNm}</Name>
              <IconWrap>
                <div>
                  <NowpeopleIcon></NowpeopleIcon>
                  <span>{entryCnt}</span>
                </div>
                <div>
                  <LikeIcon></LikeIcon>
                  <span>{likeCnt}</span>
                </div>
                <div>
                  <TotalpeopleIcon></TotalpeopleIcon>
                  <span>{entryCnt}</span>
                </div>
              </IconWrap>
            </InfoWrap>
          </LiveList>
        )
      }
    })
  }
  //console.log(store.liveSortList)
  //------------------------------------------------------------------
  useEffect(() => {
    //방송방 리스트
    getBroadList({params: {roomType: '', page: 1, records: 100, searchType: 0}})
  }, [])
  useEffect(() => {
    //방송방 리스트
    makeContents()
  }, [store.liveSortList])
  //------------------------------------------------------------------
  return (
    <Wrapper>
      <LiveFilter>
        <Refresh />
        <SelectInfo Info={PopularInfo} />
        <CategoryInfo Info={categoryInfo} />
      </LiveFilter>
      <LiveWrap onWheel={handleOnWheel} ref={settingArea}>
        <Scrollbars ref={scrollbars} autoHeight autoHeightMax={'100%'} onUpdate={scrollOnUpdate} autoHide className="scrollCustom">
          {makeContents()}
        </Scrollbars>
      </LiveWrap>
    </Wrapper>
  )
}
//------------------------------------------------------------------
//styled
const Wrapper = styled.div`
  height: calc(100% - 80px);
`
const LiveFilter = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 40px;
  margin-top: 20px;
  border-radius: 20px;
  background-color: #f5f5f5;
`
const LiveWrap = styled.div`
  height: calc(100% - 40px);
  margin-top: 18px;
  & .scrollCustom {
    & > div:nth-child(3) {
      width: 10px !important;
      height: auto;
    }
  }
`

const LiveList = styled.a`
  display: flex;
  width: 362px;
  padding: 0px 20px 20px 11px;
  margin-bottom: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  & h3 {
    font-size: 0;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
    padding: 0px 20px 20px 0px;
  }
`
const ImgWrap = styled.div`
  width: 30.93%;
  height: 106px;
  border-radius: 50%;
  background: url(${props => props.bg}) no-repeat center center / cover;
  position: relative;
`
const Sticker = styled.div`
  position: absolute;
  top: -2px;
  left: 0;
`

const Reco = styled.div`
  width: 40px;
  height: 20px;
  margin-top: 2px;
  background-color: #ec455f;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  transform: skew(-0.03deg);
`
const New = styled.div`
  width: 40px;
  height: 20px;
  margin-top: 2px;
  background-color: #fdad2b;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  transform: skew(-0.03deg);
`
const Thumb = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: url(${props => props.thumb}) no-repeat center center / cover;
`
const InfoWrap = styled.div`
  width: 69.07%;
  height: 112px;
  padding-left: 27px;
  box-sizing: border-box;
`
const Category = styled.span`
  display: block;
  color: ${COLOR_MAIN};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.43;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`
const Title = styled.h2`
  max-height: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 7px;
  color: #424242;
  font-size: 16px;
  letter-spacing: -0.4px;
  transform: skew(-0.03deg);
`
const Name = styled.h4`
  margin-top: 8px;
  color: #9e9e9e;
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`

const IconWrap = styled.div`
  display: flex;
  width: 100%;
  & div {
    display: block;
    width: 33.33%;
    margin-top: 22px;
    &:after {
      display: block;
      clear: both;
      content: '';
    }
  }
  & span {
    display: block;
    float: left;
    height: 24px;
    margin-left: 4px;
    box-sizing: border-box;
    color: #9e9e9e;
    font-size: 12px;
    line-height: 28px;
    letter-spacing: -0.3px;
    transform: skew(-0.03deg);
    @media (max-width: ${WIDTH_TABLET_S}) {
      margin-left: 3px;
    }
  }
`
const NowpeopleIcon = styled.em`
  float: left;
  width: 24px;
  height: 24px;
  background: url(${IMG_SERVER}/images/api/ic_headphone_s.png) no-repeat center center / cover;
`
const LikeIcon = styled.em`
  float: left;
  width: 24px;
  height: 24px;
  background: url(${IMG_SERVER}/images/api/ic_hearts_s.png) no-repeat center center / cover;
`
const TotalpeopleIcon = styled.em`
  float: left;
  width: 24px;
  height: 24px;
  background: url(${IMG_SERVER}/images/api/ic_people.png) no-repeat center center / cover;
`
//data---------------------------------------------------------------
//셀렉트 가데이터(포푸러)
const PopularInfo = [{option: '전체'}, {option: '추천'}, {option: '인기'}, {option: '신입'}]

//셀렉트 가데이터(카테고리)

const categoryInfo = [
  {option: '전체'},
  {option: '일상/챗'},
  {option: '노래/연주'},
  {option: '고민/사연'},
  {option: '책/힐링'},
  {option: '연애/오락'},
  {option: 'ASMR'},
  {option: '노래방'},
  {option: '성우'},
  {option: '스터디'},
  {option: '공포'},
  {option: '먹방/요리'},
  {option: '건강/스포츠'},
  {option: '기타'}
]

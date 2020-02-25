/**
 * @title 라이브탭 컨텐츠
 */
import React, {useEffect, useState, useContext, useRef} from 'react'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
//components-------------------------------------------------------------
import SelectInfo from './live-select-popular'
import CategoryInfo from './live-select-category'
import Refresh from './live-refresh'
import API from 'context/api'
import {broadcastLive} from 'constant/broadcast'
import {Context} from 'context'
import {Scrollbars} from 'react-custom-scrollbars'
//------------------------------------------------------------------
export default props => {
  //context
  const context = useContext(Context)
  //ref
  const settingArea = useRef(null) //세팅 스크롤 영역 선택자
  const scrollbars = useRef(null) // 스크롤 영역 선택자
  //0.배열Info State--------------------------------------------------
  const [broadList, setBroadList] = useState(null)
  //------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await API.broad_list({
      url: '/broad/list',
      method: 'get'
    })
    if (res.result === 'success') {
      setBroadList(res.data)
    }
    console.log(res)
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

  //라이브 맵------------------------------------------------------------------------------------------------------
  const makeContents = () => {
    if (broadList === null) return
    return broadList.list.map((live, index) => {
      const {roomType, title, bjNickNm, reco, nowpeople, entryCnt, newby, likeCnt, bgImg, bjProfImg} = live

      return (
        <LiveList key={index}>
          <ImgWrap bg={bgImg.url}>
            <Sticker>
              {reco && <Reco>{reco}</Reco>}
              {newby && <New>{newby}</New>}
            </Sticker>
            {bjProfImg && <Thumb thumb={bjProfImg.thumb62x62} />}
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
    })
  }
  //------------------------------------------------------------------
  useEffect(() => {
    fetchData({
      data: {
        roomType: '',
        page: 1,
        records: 10
      }
    })
  }, [])
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
  height: calc(100% - 48px);
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

const LiveList = styled.div`
  display: flex;
  width: 362px;
  padding: 0px 20px 20px 11px;
  margin-bottom: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #f5f5f5;
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
  color: #8556f6;
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
  background: url('http://www.hwangsh.com/img/ic_headphone_s.png') no-repeat center center / cover;
`
const LikeIcon = styled.em`
  float: left;
  width: 24px;
  height: 24px;
  background: url('http://www.hwangsh.com/img/ic_hearts_s.png') no-repeat center center / cover;
`
const TotalpeopleIcon = styled.em`
  float: left;
  width: 24px;
  height: 24px;
  background: url('http://www.hwangsh.com/img/ic_people.png') no-repeat center center / cover;
`
//data---------------------------------------------------------------
//셀렉트 가데이터(포푸러)
const PopularInfo = {
  option1: '인기순',
  option2: '추천순'
}

//셀렉트 가데이터(카테고리)

const categoryInfo = [
  {option: '건강/스포츠'},
  {option: '일상'},
  {option: '노래/연주'},
  {option: '노래방'},
  {option: '수다/채팅'},
  {option: '고민/사연'},
  {option: '건강/스포츠'},
  {option: '여행/힐링'},
  {option: '외국어'},
  {option: '책/스토리'},
  {option: '연애/오락'},
  {option: 'ASMR'},
  {option: '기타'}
]

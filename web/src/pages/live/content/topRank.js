import React, {useMemo, useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'
import Swiper from 'react-id-swiper'
import {Context} from 'context'

export default props => {
  //-------------------------------------------------------------- declare start
  const [hover, setHover] = useState(false)
  const [selected, setSelected] = useState()
  const context = useContext(Context)
  // const [roomType, setRoomType] = useState([])

  //-------------------------------------------------------------- func start
  const handleHover = (flag, index) => {
    setSelected(index)
    setHover(flag)
  }

  // 상단에 노출할 3개의 데이터
  const swiperValue = props.broadList.slice(0, 3).map((data, index) => {
    console.log('## context.common.roomType : ', context.common.roomType)
    return (
      <Contents key={index}>
        {index === selected && hover && (
          <div className="hover" onMouseLeave={() => handleHover(false, index)}>
            <button onClick={() => props.joinRoom(data)} />
          </div>
        )}
        <Image img={data.bjProfImg.thumb190x190} onMouseEnter={() => handleHover(true, index)} rank={index + 1} onClick={() => props.joinRoom(data)}>
          {window.innerWidth > 1024 && hover && index === selected ? <></> : <div>{index + 1}</div>}
          {data.gstProfImg.thumb62x62 != '' && data.gstProfImg.thumb62x62 != null && <img src={data.gstProfImg.thumb62x62} width={60} height={60} />}
        </Image>
        <Info>
          <div className="title">
            <div>{context.common.roomType != undefined && context.common.roomType[context.common.roomType.map(x => x.cd).indexOf(data.roomType.toString())].cdNm}</div>
            {data.isRecomm && <Tag bgColor={'#8555f6'}>추천</Tag>}
            {data.isPop && <Tag bgColor={'#ec455f'}>인기</Tag>}
            {data.isNew && <Tag bgColor={'#fdad2b'}>신입</Tag>}
          </div>
          <div className="roomTitle">{data.title.substring(0, 30)}</div>
          {/* <div className="roomTitle">비오는 날, 기분이 뽀송해지는 점심 라디오,점심 라디오,점심 라디오,점심 라디오</div> */}
          <div className="nickName">{data.bjNickNm}</div>
          {/* <div className="nickName">비오는 날, 기분이 뽀송해지는 점심 라디오</div> */}
          <CountArea>
            <Icon>
              <img src={'https://devimage.dalbitcast.com/images/api/ic_headphone_s.png'} width={24} height={24} />
              &nbsp;&nbsp;{data.entryCnt}
            </Icon>
            <span>|</span>
            <Icon>
              <img src={'https://devimage.dalbitcast.com/images/api/ic_hearts_s.png'} width={24} height={24} />
              &nbsp;&nbsp;{data.likeCnt}
            </Icon>
          </CountArea>
        </Info>
      </Contents>
    )
  })
  //-------------------------------------------------------------- components start
  return (
    <Container>
      <Swiper width={props.width} height={200} spaceBetween={20} shouldSwiperUpdate={true}>
        {swiperValue}
      </Swiper>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 200px;
  justify-content: flex-start;
  @media (max-width: ${WIDTH_MOBILE}) {
    height: 320px;
  }
`
const Contents = styled.div`
  display: flex;
  width: 400px;
  @media (max-width: ${WIDTH_MOBILE}) {
    flex-direction: column;
    width: 180px;
  }

  .hover {
    display: flex;
    width: 180px;
    height: 180px;
    position: absolute;
    background-color: rgba(133, 86, 246, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 999;
    border-style: solid;
    border-width: 3px;
    border-color: #8556f6;
    @media (max-width: ${WIDTH_TABLET}) {
      display: none;
    }

    & > button {
      display: flex;
      background: url('https://devimage.dalbitcast.com/images/api/ic_play_color.png') no-repeat;
      width: 48px;
      height: 48px;
    }
  }
`

const Image = styled.div`
  display: flex;
  background: url(${props => (props.img ? props.img : '')}) no-repeat;
  width: 180px;
  height: 180px;
  position: relative;

  & > div {
    display: flex;
    position: absolute;
    width: 44px;
    height: 44px;
    background: ${props => props.rank === 1 && '#8556f6'};
    background: ${props => props.rank === 2 && '#e84d6f'};
    background: ${props => props.rank === 3 && '#8556f6'};
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.6px;
    color: #fff;
    border-bottom-right-radius: 15px;
  }

  & > img {
    display: flex;
    position: absolute;
    bottom: 0;
    right: 0;
  }
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: 210px;
  height: 180px;
  align-items: center;
  margin-left: 10px;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 180px;
    height: 140px;
    margin-left: 0px;
  }

  .title {
    display: flex;
    width: 90%;
    height: 45px;
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 100%;
      height: 160px;
    }
    font-size: 14px;
    font-weight: 600;
    line-height: 1.43;
    letter-spacing: -0.35px;
    align-items: center;
    color: #bdbdbd;
  }

  .roomTitle {
    display: flex;
    width: 90%;
    height: 75px;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding-top: 0px;
      width: 100%;
      height: 210px;
      overflow: hidden;
    }
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.4px;
    word-break: break-all;
    line-height: 1.5;
  }

  .nickName {
    display: flex;
    width: 90%;
    height: 70px;
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 100%;
      height: 140px;
      margin-top: 5px;
      margin-bottom: 5px;
      align-items: center;
      overflow: hidden;
    }
    margin-top: 15px;
    word-break: break-all;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.43;
    letter-spacing: -0.35px;
    color: #8556f6;
  }
`
const Tag = styled.div`
  height: 16px;
  background: ${props => (props.bgColor ? props.bgColor : '')};
  font-size: 10px;
  font-weight: 400;
  color: #fff;
  border-radius: 8px;
  padding: 1px 6px 0px 6px;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
`
const CountArea = styled.div`
  display: flex;
  width: 85%;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    height: 50px;
  }
  height: 30px;
  justify-content: flex-start;
  align-items: center;

  & > span {
    display: flex;
    width: 15px;
    color: #e0e0e0;
    font-size: 12px;
    align-items: center;
  }
`
const Icon = styled.div`
  display: flex;
  align-items: center;
  width: 75px;
  height: 24px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.35px;
  color: #9e9e9e;
`

import React, {useMemo, useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE} from 'context/config'
import Swiper from 'react-id-swiper'
import {Context} from 'context'

export default props => {
  //-------------------------------------------------------------- declare start
  const [hover, setHover] = useState(false)
  const [selected, setSelected] = useState()
  const context = useContext(Context)
  const [roomType, setRoomType] = useState([])

  //-------------------------------------------------------------- func start
  const handleHover = (flag, index) => {
    setSelected(index)
    setHover(flag)
  }

  useEffect(() => {
    if (context.common !== undefined) {
      setRoomType(context.common.roomType)
    }
  }, [])

  // 상단에 노출할 3개의 데이터
  const swiperValue = props.broadList.slice(0, 3).map((data, index) => {
    return (
      <Contents key={index}>
        {index === selected && hover && (
          <div className="hover" onMouseLeave={() => handleHover(false, index)}>
            <button onClick={() => props.joinRoom({roomNo: data.roomNo})} />
          </div>
        )}
        <Image img={data.bgImg.url} onMouseEnter={() => handleHover(true, index)} rank={index + 1} onClick={() => props.joinRoom({roomNo: data.roomNo})}>
          {window.innerWidth > 600 && hover && index === selected ? <></> : <div>{index + 1}</div>}
          <img src={'https://devimage.dalbitcast.com/images/api/mini_profile.png'} width={60} height={60} />
        </Image>
        <Info>
          <div className="title">
            <div>{context.common.roomType && context.common.roomType[context.common.roomType.map(x => x.cd).indexOf(data.roomType)].cdNm}</div>
            {data.isRecomm && <Tag bgColor={'#8555f6'}>추천</Tag>}
            {data.isPop && <Tag bgColor={'#ec455f'}>인기</Tag>}
            {data.isNew && <Tag bgColor={'#fdad2b'}>신입</Tag>}
          </div>
          <div className="roomTitle">{data.title.substring(0, 30)}</div>
          <div className="nickName">{data.bjNickNm}</div>
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
      <Swiper width={props.width} spaceBetween={10}>
        {swiperValue}
      </Swiper>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-between;
`
const Contents = styled.div`
  display: flex;
  width: 400px;
  height: 100%;
  @media (max-width: ${WIDTH_MOBILE}) {
    flex-direction: column;
    width: 200px;
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
    @media (max-width: ${WIDTH_MOBILE}) {
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
  background-color: blue;
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

  .title {
    display: flex;
    width: 90%;
    height: 60px;
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 100%;
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
    height: 100px;
    padding-top: 10px;
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 100%;
      height: 40px;
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
    height: 45px;
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 100%;
      height: 40px;
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
    height: 35px;
  }
  height: 50px;
  padding-bottom: 2px;
  justify-content: flex-start;
  align-items: center;

  & > span {
    display: flex;
    width: 15px;
    color: #e0e0e0;
    font-size: 12px;
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
